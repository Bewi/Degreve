var logger = require('../models/logger.js');

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
  logger.insert({ type: type, date: new Date().toString(), message: message }, callback);
}

function getAll(callback){
  get(callback);
}

function getErrors(callback) {
  get(callback, "error");
}

function getWarnings(callback) {
  get(callback, "warning");
}

function getInfos(callback) {
  get(callback, "info");
}

function get(callback, type) {
  var nedbQuery = {};

  if(type) {
    nedbQuery = { type: type };
  }

  logger.find(nedbQuery, callback);
}
