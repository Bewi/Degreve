var DataStore = require('nedb');
var path = __dirname + '/../datastores';

var invoiceDataStore = DataStore({filename: path + '/invoices', autload: true});

module.exports = invoiceDataStore;
