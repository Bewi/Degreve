var express = require('express'),
  router = express.Router(),
  loggerHandler = require('../handlers/logger.handler.js');
  
router.get('/', function(req, res, next) {
  loggerHandler.getAll()
    .then(function(result) {
      res.json(result);
    }, function(error){
      next(err);
    });
});

  
module.exports = router;