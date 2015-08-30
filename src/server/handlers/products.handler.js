var product = require("../models/product.js"),
    Q = require("q");

module.exports = {
  query: query,
  get: get,
  post: post,
  put: put,
  remove: remove
};

function query(searchQuery) {
  var deferred= Q.defer();
  var nedbQuery = {};
  if (searchQuery.search) {
    var regex = { $regex:new RegExp(searchQuery.search, 'i') };
    nedbQuery = { $or: [{label: regex}, {number: regex}] };
  }

  product.count(nedbQuery, function(err, count){
    console.log(err);
    if (err)
      return deferred.reject(err);

    var orderBy = {};
    orderBy[searchQuery.orderBy] = searchQuery.orderByDirection;

    product.find(nedbQuery)
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

  product.find({ _id: id }, function(err, doc){
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(doc[0]);
  });

  return deferred.promise;
}


function post(p) {
  console.log(p);
  var deferred = Q.defer();
  product.insert(p, function(err, newDoc){
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(newDoc);
  });

  return deferred.promise;
}

function put(p) {
  var deferred = Q.defer();
  product.update({ _id: p._id }, p, {}, function (err, numReplaced) {
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(p._id);
  });

  return deferred.promise;
}

function remove(id) {
  var deferred = Q.defer();

  product.remove({ _id: id }, {}, function(err, countDeleted){
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(countDeleted);
  });

  return deferred.promise;
}
