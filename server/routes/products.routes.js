var express = require('express'),
  router = express.Router(),
  product = require('../models/product.js');

router.get('/', function(req, res, next) {
  var nedbQuery = {};
  if (req.query.search) {
    var regex = { $regex:new RegExp(req.query.search, 'i') };
    nedbQuery = { $or: [{label: regex}, {number: regex}] };
  }

  product.count(nedbQuery, function(err, count){
    if (err)
      return next(err);

    var orderBy = {};
    orderBy[req.query.orderBy] = req.query.orderByDirection;

    product.find(nedbQuery)
      .sort(orderBy)
      .skip(req.query.pageSize * req.query.page)
      .limit(req.query.pageSize)
      .exec(function(err, data) {
        if (err)
          return next(err);

          res.header('page', req.query.page);
          res.header('page-size', req.query.pageSize);
          res.header('total-count', count);
          res.json(data);
      });
  });
});

router.get('/:id', function(req, res, next) {
  product.find({ _id: req.params.id }, function(err, doc){
    if (err)
      return next(err);

    res.json(doc[0]);
  });
});

router.post('/', function(req, res, next) {
  product.insert(req.body, function(err, newDoc){
    if (err)
      return next(err);

    res.json(newDoc);
  });
});

router.put('/', function(req, res, next) {
  product.update({ _id: req.body._id }, req.body, {}, function (err, numReplaced, newDoc) {
    if (err)
      return next(err);

    res.send("Product id " + req.body._id + "modifié");
  });
});

router.delete('/:id', function(req, res) {
  product.remove({ _id: req.params.id }, {}, function(err, countDeleted){
    if (err)
      return next(err);

    res.send("Row deleted: " + countDeleted);
  });
});

module.exports = router;
