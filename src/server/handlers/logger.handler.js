var logger = require('../models/logger.js');
var Q = require('q');

module.exports = {
  error: error,
  warn: warn,
  notify: notify,
  log: log,
  getAll: getAll,
  getErrors: getErrors,
  getWarnings: getWarnings,
  getInfos: getInfos
};

function error(message) {
  return this.log("error", message);
}

function warn(message) {
  return this.log("warning", message);
}

function notify(message) {
  return this.log("info", message);
}

function log(type, message) {
    var deferred = Q.defer();
    
    logger.insert({ type: type, date: new Date(), message: message }, function(err) {
        if (err){
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });
    
    return deferred.promise;
}

function getAll(){
  return get();
}

function getErrors() {
  return get("error");
}

function getWarnings() {
  return get("warning");
}

function getInfos() {
  return get("info");
}

function get(type) {
  var deferred = Q.defer()
  var nedbQuery = {};

  if(type) {
    nedbQuery = { type: type };
  }

  logger.find(nedbQuery, function(err, docs) {
        if (err) 
            deferred.reject(err);
        else    
            deferred.resolve(docs);
  });
  
  return deferred.promise;
}
