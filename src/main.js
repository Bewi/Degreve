var app = require('app');
var server = require('./server/app.js');
var BrowserWindow = require('browser-window');
var squirrel = require('./squirrel.js');
var mainWindow = null;

if (squirrel.handleEvent()) {
   return;
}

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    server.stop();
    app.quit();
  }
});

app.on('ready', function() {
  server.start();

  mainWindow = new BrowserWindow({width: 1000, height: 1000});
  mainWindow.setMinimumSize(770, 450);
  mainWindow.maximize();
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
