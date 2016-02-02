var ws = require('nodejs-websocket'),
  fs = require('fs'),
  R = require('ramda'),
  hero = require('../models/hero.js'),
  loggerHandler = require('../handlers/logger.handler.js'),
  basePath = process.resourcesPath + '\\app\\server\\datastores\\';



basePath = 'C:\\Projects\\GitHub\\Degreve\\src\\server\\datastores\\';

module.exports = { start: start };

function start() {
  ws.createServer(function (conn) {
    console.log("New connection");

    var syncStatus = { total: 0, processed: 0, failed: 0 };
    
    conn.on("text", function (str) {
        switch (str) {
            case 'startSync': 
                sync(); 
                break;
            case 'startRestore': 
                restore(); 
                break;
        }       
    });

    conn.on("error", function(err) {
        loggerHandler.error(err);
    });

    function sync() {
        var files = fs.readdirSync(basePath);
        syncStatus.total = files.length;
        syncStatusUpdated();
        R.forEach(readFile, files);
    }
    
    function restore() {
        hero.getRemoteFileNames().then(function(fileNames) {
            syncStatus.total = fileNames.length;
            syncStatusUpdated()
            R.forEach(writeFile, fileNames);            
        }, function(err) {
            loggerHandler.error(err);
            conn.close(500, 'Error getting remote file names');
        });       
    }

    function readFile(fileName) {
        try {
            var file = fs.readFileSync(basePath + fileName, 'utf8');
            hero.save(fileName, file).then(onSuccess, onError);
        } catch (ex) {
            onError(ex.message);
        }
    }
    
    function writeFile(fileName) {
        hero.release(fileName).then(function(data) {
            fs.writeFile(basePath + fileName, data, function(err) {
                if (err) {
                    onError(err);
                } else {
                    onSuccess();   
                }                
            });
        }, onError).finally(syncStatusUpdated);
    }
    
    function onError(err) {
        loggerHandler.error(err);
        syncStatus.failed ++;
        syncStatusUpdated();
    }
    
    function onSuccess() {
        syncStatus.processed ++;
        syncStatusUpdated();
    }
    
    function syncStatusUpdated() {
        conn.sendText(JSON.stringify(syncStatus));

        if (syncStatus.processed + syncStatus.failed >= syncStatus.total) {
            conn.close();
        }
    }
    
    
  }).listen(4243)
    .on('error', function(errObj) {
      loggerHandler.error(JSON.stringify(errObj));
    }).on('listening', function() {
      console.log("Web socket listening to ws://localhost:4243");
    });
}
