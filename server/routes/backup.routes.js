var express = require('express'),
  router = express.Router(),
  fs = require('fs'),
  hero = require('../models/hero.js'),
  basePath = process.resourcesPath + '\\app\\server\\datastores\\';

router.post('/restore', function(req, res, next) {
  var files = fs.readdirSync(basePath);
  var countSucceeded = 0;
  var countFailed = 0;

  for (var i = 0; i < files.length; i ++) {
    restoreFile(files[i]);
  }

  function restoreFile(fileName, callback)
  {
    hero.release(fileName, function(data, err) {
      if (err) {
        countFailed ++;
      } else {
        fs.writeFileSync(basePath + fileName, data);
        countSucceeded ++;
      }

      if (countSucceeded + countFailed == files.length)
        res.send("Restore completed with " + countSucceeded + " files restored and " + countFailed + " restore fails.");
    });
  }
});

module.exports = router;
