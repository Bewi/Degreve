var Datastore = require('nedb');
var path = __dirname + "/../datastores";

var productDatastore = new Datastore({ filename: path + '/customers', autoload: true });

module.exports = productDatastore;
