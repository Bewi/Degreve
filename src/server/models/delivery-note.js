var Datastore = require('nedb');
var path = __dirname + '/../datastores';

var deliveryNoteDataStore = new Datastore({filename: path + '/deliveryNotes', autoload: true});

module.exports = deliveryNoteDataStore;
