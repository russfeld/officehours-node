var express = require('express')
var router = express.Router()

// Load CAS
var cas = require('../configs/cas')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
})

router.get('/app', function (req, res, next) {
  res.render('app')
})

router.get( '/logout', cas.logout );

router.get('/cas_test', cas.bounce, function (req, res, next) {
  //res.json(req.session[cas.session_name])
  res.json(req.session[cas.session_info])
})

module.exports = router
