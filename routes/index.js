var express = require('express');
var router = express.Router();

// Load CAS
var cas = require('../lib/cas')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/app', cas.bounce, function(req, res, next) {
  res.render('app', { title: 'App', cas_user: req.session[ cas.session_name ]});
})

router

module.exports = router;
