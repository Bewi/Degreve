var invoice = require('../models/invoice.js'),
    Q = require('q');

module.exports = {
  query: query
};

function query() {
  var deferred = Q.defer();

  deferred.resolve([]);

  return deferred.promise;
}
