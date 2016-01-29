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

function error(message, callback) {
  this.log("error", message, callback);
}

function warn(message, callback) {
  this.log("warning", message, callback);
}

function notify(message, callback) {
  this.log("info", message, callback);
}

function log(type, message, callback) {
  logger.insert({ type: type, date: new Date(), message: message }, callback);
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
