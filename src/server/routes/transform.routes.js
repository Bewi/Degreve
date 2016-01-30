var express = require('express'),
  router = express.Router(),
  transform = require('../models/transform.js');

router.post('/', function(req, res, next) {
    transform.perform();
    res.sendStatus(200);
});

module.exports = router;