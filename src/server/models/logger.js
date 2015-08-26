var Datastore = require('nedb');
var application_root = __dirname;

var path = __dirname + "/../datastores";

module.exports = new Datastore({ filename: path + '/log', autoload: true });
