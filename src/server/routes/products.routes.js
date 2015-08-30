var express = require('express'),
  router = express.Router(),
  productHandler = require('../handlers/products.handler.js');

router.get('/', function(req, res, next) {
  productHandler.query(req.query)
    .then(function(result) {
      res.header('page', req.query.page);
      res.header('page-size', req.query.pageSize);
      res.header('total-count', result.count);
      res.json(result.data);
    }, function(error){
      next(err);
    });
});

router.get('/:id', function(req, res, next) {
  productHandler.get(req.params.id).then(function(product) {
    res.json(product);
  }, function(err){
    next(err);
  });
});

router.post('/', function(req, res, next) {
  productHandler.post(req.body).then(function(doc) {
    res.json(doc);
  }, function(err) {
    next(err);
  });
});

router.put('/', function(req, res, next) {
  productHandler.put(req.body).then(function(id) {
    res.send("Product id " + id + " edited");
  }, function(err) {
    next(err);
  });
});

router.delete('/:id', function(req, res) {
  productHandler.remove(req.params.id).then(function(countDeleted){
    res.send("Row deleted: " + countDeleted);
  }, function(err) {
    next(err);
  });
});

module.exports = router;
