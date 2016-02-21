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
        nedbQuery = { $or: [{name: regex}, {_id: regex}] };
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
    var deferred = Q.defer();

    lastId().then(function(id) {
        c._id = id;
        c.dateAdded = new Date().toString;
        customer.insert(c, function(err, newDoc){
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(newDoc);
        });
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function put(c) {
    var deferred = Q.defer();
    
    c.lastModification = new Date().toString;
    customer.update({ _id: c._id }, c, {}, function (err, numReplaced) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(c._id);
    });

    return deferred.promise;
}

function remove(id) {
    var deferred = Q.defer();

    customer.remove({ _id: id }, {}, function(err, countDeleted){
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(countDeleted);
    });

    return deferred.promise;
}

function lastId() {
    var deferred = Q.defer();

    customer.find({ _id: { $regex: /^[0-9]*$/ } }).sort({ _id: -1 }).limit(1).exec(function(err, docs) {
    if (err)
        deferred.reject(err);
    else if (docs.length <= 0)
        deferred.resolve(1000);
    else
        deferred.resolve(String(parseInt(docs[0]._id) + 1));
    });

    return deferred.promise;
}
