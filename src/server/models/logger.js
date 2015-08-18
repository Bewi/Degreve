var Datastore = require('nedb');
var application_root = __dirname;

var path = __dirname + "/../datastores";

var logDatastore = new Datastore({ filename: path + '/log', autoload: true });

module.exports = { error: error, warn: warn, notify: notify };

function error(message) {
  log("error", message);
}

function warn(message) {
  log("warning", message);
}

function notify(message) {
  log("info", message);
}

function log(type, message) {
  logDatastore.insert({ type: type, date: new Date(), message: message });
}
