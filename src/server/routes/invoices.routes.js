var express = require('express'),
    router = express.Router(),
    invoicesHandler = require('../handlers/invoices.handler.js');

router.get('/', function(req, res, next) {
  invoicesHandler.query(req.query)
    .then(function(result) {
      res.header('page', req.query.page);
      res.header('page-size', req.query.pageSize);
      res.header('total-count', result.count);
      res.json(result.data);
    }, function(error){
      next(err);
    });
});

module.exports = router;
