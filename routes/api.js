var express = require('express');
var router = express.Router();

// Load CAS
var cas = require('../lib/cas')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
