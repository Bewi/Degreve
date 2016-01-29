var https = require('https');
var logger = require('./logger.js');
var tokens = require('./hero.tokens.js');
var Q = require('q');

var host = 'api-content.dropbox.com';
var port = 443;
var headers = {
  'Authorization': tokens
};

module.exports = {
  save: save,
  release: release,
  getRemoteFileNames: getRemoteFileNames
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
    var deferred = Q.defer();
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
            deferred.resolve(result);
        });
    });

    req.on('error', function(err) {
        logger.error(err.message);
        deferred.reject(err);
    });

    req.end();
    
    return deferred.promise;
}

function getRemoteFileNames() {
    var deferred = Q.defer();
    var options = {
        host: 'api.dropboxapi.com',
        port: port,
        path: '/1/metadata/auto/',
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
            var fileNames = [];
            
            var metadata = JSON.parse(result);
            for(var index in metadata.contents) {
                fileNames.push(metadata.contents[index].path.replace('/',''));
            }
            
            deferred.resolve(fileNames);
        });
    });

    req.on('error', function(err) {
        logger.error(err.message);
        deferred.reject(err);
    });

    req.end();
    
    return deferred.promise;
}
