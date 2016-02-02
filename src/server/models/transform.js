var replace = require("replace"),
	copy = require("directory-copy"),
	fs = require("fs"),
	concat = require("concat"),
	del = require("del"),
    Q = require("q"),
    customer = require('../models/customer'),
    invoice = require('../models/invoice'),
    invoiceProduct = require('../models/invoice-product'),
    product = require('../models/product'),
    productHandler = require('../handlers/products.handler.js'),
    R = require('ramda');

var srcPath = __dirname + '/../datastores/transform';
var destPath = __dirname + '/../datastores';
    
module.exports = {
    perform : perform
}
    
function perform() {
    var deferred = Q.defer();
   
    copy({
        src: srcPath,
        dest: destPath
    }, function() {
        console.log('Directory copied');			
                
        fs.renameSync(destPath + "/billProducts", destPath + "/invoiceProducts");
        
        console.log('Rename done');

        mergeDeliveryNotesToBills()
            .then(reloadDbs)
            .then(getClosedInvoicesIds)
            .then(getInvoicesProducts)
            .then(getInvoiceProductsMerge)
            .then(updateInvoiceProducts)
            .then(function() {
                deferred.resolve();
            }, function(err) {
                deferred.reject(err);
            });	
    });
    
    return deferred.promise;
}

function mergeDeliveryNotesToBills() {
    var deferred = Q.defer();
	replace({
		regex: "},{",
		replacement: ",\"postponed\":true},{",
		paths: [destPath + "/deliveryNotes"],
		recursive: true,
		silent: false,
		count: true
	});
	
	replace({
		regex: "}(?!,)",
		replacement: ",\"postponed\":true}",
		paths: [destPath + "/deliveryNotes"],
		recursive: true,
		silent: false,
		count: true
	});
	
	replace({
		regex: "},{",
		replacement: ",\"postponed\":false},{",
		paths: [destPath + "/bills"],
		recursive: true,
		silent: false,
		count: true
	});
	
	replace({
		regex: "}(?!,)",
		replacement: ",\"postponed\":false}",
		paths: [destPath + "/bills"],
		recursive: true,
		silent: false,
		count: true
	});

	console.log("start concat");
	
	concat([destPath + "/bills", destPath + "/deliveryNotes"], destPath + "/invoices", function(error) {
		if (error) {
			console.error("!!! An error occured: ");
			console.error(error);
			return;
		}
		
		console.log("bills and delivery notes merged to invoices");
		
		del.sync([destPath + "/deliveryNotes", destPath + "/bills"]);
		
		console.log("Bills and Delivery notes files deleted");
		
		process();
        
        deferred.resolve();
	});
    
    return deferred.promise;
}

function process() {
	replace({
		regex: "[\\[\\]]",
		replacement: "",
		paths: [destPath],
		recursive: true,
		silent: false,
		count: true
	});

	replace({
		regex: "},{",
		replacement: "}\n{",
		paths: [destPath],
		recursive: true,
		silent: false,
		count: true
	});

	replace({
		regex: "\"id\"",
		replacement: "\"_id\"",
		paths: [destPath],
		recursive: true,
		silent: false
	});

	replace({
		regex: "\"_id\":(\\d*)",
		replacement: "\"_id\":\"$1\"",
		paths: [destPath + '/customers', destPath + '/products'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});

	replace({
		regex: "\"customerId\":(\\d*)",
		replacement: "\"customerId\":\"$1\"",
		paths: [destPath + '/invoices'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: "\"productId\":\"?(\\d*E?)\"?",
		replacement: "\"productId\":\"$1\"",
		paths: [destPath + '/invoiceProducts'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: "\"billId\"",
		replacement: "\"invoiceId\"",
		paths: [destPath + '/invoiceProducts'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: "\"invoiceId\":(?!\")(\\d*)",
		replacement: "\"invoiceId\":\"$1\"",
		paths: [destPath + '/invoiceProducts'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
	
	replace({
		regex: ".*dateDeleted.*\\r?\\n",
		replacement: "",
		paths: [destPath + '/invoices'],
		recursive: true,
		silent: false,
		count: true,
		quiet: false
	});
}

function reloadDbs() {
    var productDeferred = Q.defer();
    var customerDeferred = Q.defer();
    var invoiceDeferred = Q.defer();
    var invoiceProductDeferred = Q.defer();
    
    product.loadDatabase(function(err) {
        if (err) {
            productDeferred.reject(err);
        } else {
            productDeferred.resolve();
        }
    });
    
    customer.loadDatabase(function(err) {
        if (err) {
            customerDeferred.reject(err);
        } else {
            customerDeferred.resolve();
        }
    });
    
    invoice.loadDatabase(function(err) {
        if (err) {
            invoiceDeferred.reject(err);
        } else {
            invoiceDeferred.resolve();
        }
    });
    
    invoiceProduct.loadDatabase(function(err) {
        if (err) {
            invoiceProductDeferred.reject(err);
        } else {
            invoiceProductDeferred.resolve();
        }
    });
    
    return Q.all([productDeferred.promise, customerDeferred.promise, invoiceDeferred.promise, invoiceProductDeferred.promise]);    
}

function getClosedInvoicesIds() {
    var deferred = Q.defer();
    
    invoice.find({ postponed: false }, { _id: 1, dumb: 1 }, function(err, docs) {
        if (err) {
            deferred.reject(err);
        } else {
            var ids = [];
            
            for (var index in docs) {
                ids.push(docs[index]._id);
            }
            
            deferred.resolve(ids);
        }
    });
    
    return deferred.promise;
}

function getInvoicesProducts(invoiceIds) {
    var deferred = Q.defer();
    
    // select all invoiceProducts that doesn't contains the label yet.
    invoiceProduct.find({ invoiceId: { $in: invoiceIds }, label: { $exists: false }, isExtra: { $exists: false }}, function(err, docs) {
       if (err) {
           deferred.reject(err);
       } else {
           deferred.resolve(docs);
       }
    });
    
    return deferred.promise;    
}

function getInvoiceProductsMerge(invoiceProducts) {
    var deferred = Q.defer();
    
    product.find({}, function(err, products) {
       R.map(function(invoiceProduct) {
           var product = R.find(R.propEq('_id', invoiceProduct.productId), products);
            invoiceProduct.priceSell = product.priceSell;
            invoiceProduct.priceBuy = product.priceBuy;
            invoiceProduct.vat = product.vat;
            invoiceProduct.label = product.label;   
            invoiceProduct.number = product.number;   
        }, invoiceProducts);
        
        deferred.resolve(invoiceProducts);
    });
        
    return deferred.promise;
}

function updateInvoiceProducts(invoiceProductsMerged) {
    var promises = [];
    
    promises = R.map(updateInvoiceProduct, invoiceProductsMerged);
    
    return Q.all(promises);
}

function updateInvoiceProduct(doc) {
    var deferred = Q.defer();
    
    invoiceProduct.update({ _id: doc._id }, doc, function(err) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    })
    
    return deferred.promise;
}