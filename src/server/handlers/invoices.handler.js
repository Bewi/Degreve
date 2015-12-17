var invoice = require('../models/invoice.js'),
    customersHandler = require('./customers.handler.js'),
    Q = require("q");

module.exports = {
  query: query
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

function linkCustomer(invoice) {
  var promise = customersHandler.get(invoice.customerId.toString());

  promise.then(function(c) {
    invoice.customer = c;
  });

  return promise;
}
