var Datastore = require('nedb');
var path = __dirname + '/../datastores';

var invoiceDataStore = new Datastore({filename: path + '/invoices', autoload: true});

module.exports = invoiceDataStore;
