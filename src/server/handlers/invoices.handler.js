var invoice = require('../models/invoice.js'),
    invoiceProduct = require('../models/invoice-product.js'),
    product = require('../models/product.js'),
    customersHandler = require('./customers.handler.js'),
    Q = require("q");

module.exports = {
  query: query,
  get: get,
  getNextNumber: getNextNumber
};

function query(searchQuery) {
  var deferred = Q.defer();

  var nedbQuery = {};
  if (searchQuery.search) {
    var regex = { $regex:new RegExp(searchQuery.search, 'i') };
    nedbQuery = { $or: [{number: regex}] };
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
  invoice.find({}, {number:1, _id:0}).sort({ number: -1 }).limit(1).exec(function(err, docs) {
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(parseInt(docs[0].number) + 1);
  });

  return deferred.promise;
}

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

  invoiceProduct.find({invoiceId: invoice._id}, {productId: 1, amount: 1, _id:0}, function(err, invoiceProducts) {
    if (err) {
        deferred.reject(err);
        return;
    }

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
        for (var j in products) {
          if (invoiceProducts[i].productId === products[j]._id) {
            products[j].amount = invoiceProducts[i].amount;
            break;
          }
        }
      }

      invoice.products = products;

      deferred.resolve(invoice);
    });
  });

  return deferred.promise;
}

function linkCustomer(invoice) {
  var deferred = Q.defer();

  customersHandler.get(invoice.customerId.toString()).then(function(c) {
    invoice.customer = c;
    deferred.resolve(invoice);
  });

  return deferred.promise;
}
