var express = require('express');
var router = express.Router();

// Load CAS
var cas = require('../lib/cas');

// Load Database
var db = require('../lib/db');

/* GET API Version. */
router.get('/', cas.bounce, function(req, res, next) {
  res.json({version: 1.0});
});

module.exports = router;
