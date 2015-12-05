var customer  = require("../models/customer.js"),
    Q = require("q");

  module.exports = {
    query: query,
    get: get,
    post: post,
    put: put,
    remove: remove
  };

  function query(searchQuery) {
    var deferred = Q.defer();
    var nedbQuery = {};
    if (searchQuery.search) {
      var regex = { $regex:new RegExp(searchQuery.search, 'i') };
      nedbQuery = { $or: [{name: regex}] };
    }

    customer.count(nedbQuery, function(err, count){
      if (err)
        return deferred.reject(err);

      var orderBy = {};
      orderBy[searchQuery.orderBy] = searchQuery.orderByDirection;

      customer.find(nedbQuery)
        .sort(orderBy)
        .skip(searchQuery.pageSize * searchQuery.page)
        .limit(searchQuery.pageSize)
        .exec(function(err, data) {
          if (err)
            deferred.reject(err);
          else
            deferred.resolve({data: data, count: count});
        });
    });

    return deferred.promise;
  }

  function get(id) {
    var deferred = Q.defer();

    customer.findOne({ _id: id }, function(err, doc){
      if (err)
        deferred.reject(err);
      else
        deferred.resolve(doc);
    });

    return deferred.promise;
  }

  function post(c) {

  }

  function put(c) {

  }

  function remove(id) {

  }
