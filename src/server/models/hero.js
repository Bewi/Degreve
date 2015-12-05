var https = require('https');
var logger = require('./logger.js');

var host = 'api-content.dropbox.com';
var port = 443;
var headers = {
  'Authorization': 'Bearer 2nKLmRHQ45gAAAAAAABLXiVy4c9Htg3GU2FogGwiXpn1GHcu-NyR1pCP-57vaXJc'
};

module.exports = {
  save: save,
  release: release
};

function save(fileName, data, callback) {
  var options = {
    host: host,
    port: port,
    path: '/1/files_put/auto/' + fileName,
    method: 'POST',
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');

    res.on('data', function (data) {
      if (callback)
       callback(data);
    });
  });

  req.on('error', function(err) {
    logger.error(err.message);
  });

  req.write(data);
  req.end();
}

function release(fileName, callback) {
  var options = {
    host: host,
    port: port,
    path: '/1/files/auto/' + fileName,
    method: 'GET',
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    var result = "";
    res.on('data', function (data, err) {
      result += data;
    });

    res.on('end', function() {
        if (callback)
         callback(result);
    });
  });

  req.on('error', function(err) {
    logger.error(err.message);
  });

  req.end();
}
