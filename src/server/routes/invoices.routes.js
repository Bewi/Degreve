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
    }, function(err){
      next(err);
    });
});

router.get('/nextNumber', function(req, res, next) {
  invoicesHandler.getNextNumber().then(function(nextNumber) {
    res.json({nextNumber: nextNumber});
  }, function(err) {
    next(err);
  });
});

router.get('/:id', function(req, res, next) {
  invoicesHandler.get(req.params.id).then(function(doc) {
    res.json(doc);
  }, function(err){
    next(err);
  });
});

router.post('/', function(req, res, next) {
    invoicesHandler.post(req.body).then(function(doc) {
        res.sendStatus(200);
    }, function(err) {
        next(err);
    });
});

router.put('/', function(req, res, next) {
    console.log("PUT Invoice");
    invoicesHandler.put(req.body).then(function(doc) {
        res.sendStatus(200);
    }, function(err) {
        next(err);
    });
});

module.exports = router;
