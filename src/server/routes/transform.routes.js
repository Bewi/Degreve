var express = require('express'),
  router = express.Router(),
  transform = require('../models/transform.js');

router.post('/', function(req, res, next) {
    transform.perform().then(function() {
        res.sendStatus(200);        
    }, function(err) {
        res.sendStatus(500);
    });
});

module.exports = router;