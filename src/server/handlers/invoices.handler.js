var invoice = require('../models/invoice.js'),
    invoiceProduct = require('../models/invoice-product.js'),
    product = require('../models/product.js'),
    customersHandler = require('./customers.handler.js'),
    Q = require("q"),
    R = require("ramda");

module.exports = {
    query: query,
    get: get,
    getNextNumber: getNextNumber,
    validateNumber: validateNumber,
    post: post,
    put: put
};

function query(searchQuery) {
    var deferred = Q.defer();

    var nedbQuery = {
        postponed: searchQuery.postponed ? true : false
    };
    
    // If a customerId is specified on the url, this is the main query.
    if (searchQuery.customerId) {
        nedbQuery.customerId = searchQuery.customerId;
    } else if (searchQuery.search) {
        nedbQuery.number =  isNaN(searchQuery.search) ? 0 : parseInt(searchQuery.search);
    }
    
    invoice.count(nedbQuery, function(err, count){
        if (err) 
            return deferred.reject(err);

        var orderBy = {};
        orderBy[searchQuery.orderBy] = searchQuery.orderByDirection;

        invoice.find(nedbQuery)
        .sort(orderBy)
        .skip(searchQuery.pageSize * searchQuery.page)
        .limit(searchQuery.pageSize)
        .exec(function(err, data) {
            if (err)
             deferred.reject(err);
            else {
                var promises = [];
                for (var index in data) {
                    promises.push(linkCustomer(data[index]));
                }

                Q.all(promises).done(function() {
                    deferred.resolve({data: data, count: count});
                });
            }
        });
    });

    return deferred.promise;
}

function get(id) {
    return getInvoice(id).then(linkCustomer).then(setProducts);   
}

function getNextNumber() {
    var deferred = Q.defer();
    invoice.find({}, {number:1, _id:0}).sort({ number: -1 }).limit(10).exec(function(err, docs) {
        if (err) {
            deferred.reject(err);
        }
        else if(docs.length <= 0) {
            deferred.resolve(1000);
        } else {
            var numbers = R.pluck('number')(docs);
            var nextNumber = R.dropWhile(function(num) {
                return numbers.indexOf(num - 1) > -1;                
            }, numbers)[1] + 1; 
            
            deferred.resolve(nextNumber);
        }
    });

    return deferred.promise;
}

function validateNumber(number) {
    var deferred = Q.defer();
    
    invoice.count({ number: parseInt(number) }, function(err, count) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(count <= 0);
        }
    });
    
    return deferred.promise;
}

function post(invoice) {    
    invoice.dateAdded = new Date();
    return saveInvoicePrimaryData(invoice).then(function(newDoc) {
        return saveInvoiceProducts(newDoc, invoice.products);  
    });
}

function put(invoice) {
    invoice.lastModification = new Date();
    return saveInvoicePrimaryData(invoice).then(function() {
        return restoreStock(invoice);  
    }).then(function() {
        return clearInvoiceProducts(invoice._id); 
    }).then(function(newDoc) {
        return saveInvoiceProducts(invoice, invoice.products);
    });
}

/*** Privates behavior ***/

function getInvoice(id) {
    var deferred = Q.defer();

    invoice.findOne({ _id: id}, function(err, doc) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(doc);
    });

    return deferred.promise;
}

function setProducts(invoice) {
    var deferred = Q.defer();
    
    invoiceProduct.find({invoiceId: invoice._id}, {_id:0}, function(err, invoiceProducts) {
        if (err) {
            deferred.reject(err);
            return;
        }
        
        // If invoice is closed, all product data is stored in invoiceProducts.
        // To avoid invoice modification if a product is changed after an invoice is closed.
        if (!invoice.postponed) {
            invoice.products = R.map(function(invoiceProduct) {
                var mappedInvoiceProduct = R.clone(invoiceProduct);
                mappedInvoiceProduct._id = invoiceProduct.productId;
                delete mappedInvoiceProduct.productId;
                return mappedInvoiceProduct;
            }, invoiceProducts);
            deferred.resolve(invoice);
        } else {
            var ids = [];

            for (var index in invoiceProducts) {
                ids.push(invoiceProducts[index].productId);
            }
            
            product.find({ _id: {$in: ids}}, function(err, products) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                
                for(var i in invoiceProducts) {
                    if (invoiceProducts[i].isExtra) {
                        invoiceProducts[i]._id = invoiceProducts[i].productId;
                        products.push(invoiceProducts[i]);
                        continue;
                    }

                    for (var j in products) {
                        if (invoiceProducts[i].productId === products[j]._id) {
                            products[j].amount = invoiceProducts[i].amount;
                            products[j].defect = invoiceProducts[i].defect;
                            products[j].returned = invoiceProducts[i].returned;
                            break;
                        }
                    }
                }

                invoice.products = products;

                deferred.resolve(invoice);
                
            });
        }        
    });

    return deferred.promise;
}

function linkCustomer(invoice) {
    if (!invoice.customerId)
        return Q.when(invoice); 
        
    var deferred = Q.defer();
    
    customersHandler.get(invoice.customerId.toString()).then(function(c) {
        invoice.customer = c;
        deferred.resolve(invoice);
    });

    return deferred.promise;
}

function saveInvoicePrimaryData(invoiceData) {
    var deferred = Q.defer();    
    
    var data = {
       number: invoiceData.number,
       paymentMethod: invoiceData.paymentMethod,
       discount: invoiceData.discount,
       date: invoiceData.date,
       dateAdded: new Date(),
       _totalPrice: invoiceData._totalPrice,
       _totalVAT: invoiceData._totalVAT,
       _total: invoiceData._total,
       customerId: invoiceData.customer ? invoiceData.customer._id : undefined,
       postponed: invoiceData.postponed ? true : false
    }
    
    if (data.postponed === true) {
        data.lastModification = new Date();
    }
    
    if (invoiceData._id) {
        invoice.update({ _id: invoiceData._id}, data, callback);    
    } else {
        invoice.insert(data, callback);
    }    
    
    function callback(err, newDoc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(newDoc);
        }
    }
    
    return deferred.promise;
}

function restoreStock(invoice) {
    var oldInvoice = {
        _id: invoice._id,
        postponed: true
    };
    
    var productsPromises = []
    
    return setProducts(oldInvoice).then(function() {
        for (var index in oldInvoice.products) {
            productsPromises.push(saveProduct(oldInvoice.products[index], true));
        }       
        
        return Q.all(productsPromises).then(function(result) {
            R.forEach(function(newP) {
                var prodToUpdate = R.find(R.propEq('_id', newP._id), invoice.products);
                if(prodToUpdate) {
                    prodToUpdate.stock = newP.stock;
                }
            }, result)
            
            return Q.resolve(result);
        });
    });
}

function clearInvoiceProducts(invoiceId) {
    var deferred = Q.defer();
    invoiceProduct.remove({invoiceId: invoiceId}, {multi: true}, function(err, count) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(count);
        } 
    });
    
    return deferred.promise;
}

function saveInvoiceProducts(invoice, products) {
    var productInvoicesPromises = [];
    var productPromises = [];
    
    for(var index in products) {
        var product = products[index];
        productInvoicesPromises.push(saveInvoiceProduct(invoice, product));
        
        if (!product.isExtra && !product.defect) {
            productPromises.push(saveProduct(product));
        }
    }
    
    return Q.all(productInvoicesPromises);
}

function saveInvoiceProduct(invoice, product) {
    var deferred = Q.defer();
    
    var data  = {
        invoiceId: invoice._id,
        dateAdded: new Date(),
        productId: product._id,
        amount: product.amount,
        defect: product.defect,
        returned: product.returned
    };
    
    if (!invoice.postponed || product.isExtra) {
        data.isExtra = product.isExtra,
        data.priceSell = product.priceSell,
        data.priceBuy = product.priceBuy,
        data.vat = product.vat,
        data.label = product.label
    }    
    
    invoiceProduct.insert(data, function(err, newDoc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(newDoc);
        }
    })
    
    return deferred.promise;
}

function saveProduct(productData, restore) {
    var deferred = Q.defer();
    
    var sign = productData.returned ? 1 : -1;
    
    if (restore) {
        sign *= -1;
    }
    
    var newStock = productData.stock + (productData.amount * sign);
    productData.lastModification = new Date();
    product.update({ _id: productData._id }, { $set : { stock: newStock }}, function(err, count) {
        if (err) {
            deferred.reject(err);
        } else {
            productData.stock = newStock;
            deferred.resolve(productData);
        }
    });
    
    return deferred.promise;
}
