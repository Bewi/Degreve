var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  products = require('./routes/products.routes.js'),
  customers = require('./routes/customers.routes.js'),
  invoices = require('./routes/invoices.routes.js'),
  logs = require('./routes/logs.routes.js'),
  backupSocket = require('./routes/backup.socket.js'),
  logger = require('./handlers/logger.handler.js'),
  transform = require('./routes/transform.routes.js');

var app = express();

app.use(bodyParser.json());

app.use(queryFormatter);

/* *** Wire up requests *** */
app.get('/', function (req, res) {
  res.send('Service running');
});

app.use('/products', products);
app.use('/customers', customers);
app.use('/invoices', invoices);
app.use('/logs', logs);
app.use('/transform', transform);
/* ****** */

// Error handling
app.use(errorHandler);

var server;
var started = false;

module.exports = { start: start, stop: stop };

function errorHandler(err, req, res, next) {
  logger.error(err);
  res.status(500);
  res.send({ error: err });
}

function queryFormatter(req, res, next) {
  req.query.pageSize = parseInt(req.query.pageSize);
  req.query.page = parseInt(req.query.page);
  next();
}

function start() {
  server = app.listen(4242, function() {
    var host = server.address().address;
    var port = server.address().port;

    if (host == '0.0.0.0')
      host = 'localhost';

    console.log('Listening at http://%s:%s', host, port);

    started = true;
  });

  backupSocket.start();
}

function stop(){
  if (!started)
    return;

  server.close();
  started = false;
}
