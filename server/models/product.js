var Datastore = require('nedb');
var application_root = __dirname;

var path = __dirname + "/../datastores";

var productDatastore = new Datastore({ filename: path + '/products', autoload: true });

module.exports = productDatastore;
