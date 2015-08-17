var ws = require('nodejs-websocket'),
  fs = require('fs'),
  hero = require('../models/hero.js'),
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
            console.error(err);
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
  }).listen(4243);

  console.log("Web socket listening to ws://localhost:4242");
}
