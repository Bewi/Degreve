var ws = require('nodejs-websocket'),
  fs = require('fs'),
  hero = require('../models/hero.js'),
  logger = require('../models/logger.js'),
  basePath = process.resourcesPath + '\\app\\server\\datastores\\';

module.exports = { start: start };

function start() {
  ws.createServer(function (conn) {
    console.log("New connection");

    var syncStatus = { total: 0, processed: 0 };

    conn.on("text", function (str) {
			if (str === 'startSync') {
				syncStatus.processed = 0;
				sync();
			}
		});

    conn.on("error", function(err) {
      logger.error(err);
    });

		function sync() {
      var files = fs.readdirSync(basePath);

      syncStatus.total = files.length;
      conn.sendText(JSON.stringify(syncStatus));

      for (var i = 0; i < files.length; i ++) {
          readFile(files[i]);
      }

      function readFile(fileName) {
        fs.readFile(basePath + fileName, 'utf8', function (err, data) {
          if (err) {
            logger.error(err);
          }
          else {
            hero.save(fileName, data, onFileSync);
          }
        });
      }
		}

    function onFileSync() {
      syncStatus.processed ++;
      conn.sendText(JSON.stringify(syncStatus));

      if (syncStatus.processed >= syncStatus.total) {
        conn.close();
      }
    }
  }).listen(4243)
    .on('error', function(errObj) {
      logger.error(JSON.stringify(errObj));
    }).on('listening', function() {
      console.log("Web socket listening to ws://localhost:4243");
    });
}
