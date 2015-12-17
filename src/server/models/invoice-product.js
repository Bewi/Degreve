var Datastore = require('nedb');
var path = __dirname + '/../datastores';

var invoiceProductDataStore = new Datastore({filename: path + '/invoiceProducts', autoload: true});

module.exports = invoiceProductDataStore;
