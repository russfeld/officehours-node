var express = require('express');
var router = express.Router();

// Load CAS
var cas = require('../configs/cas');

// Load Database
var db = require('../configs/db');

// Load Middleware
var user_id = require('../middlewares/user_id');
var is_admin = require('../middlewares/is_admin');

// Block non-authenticated access
router.use(cas.block);

// Cache User ID
router.use(user_id);

// Populate Session with Admin
router.use(is_admin);

/* GET API Version. */
router.get('/', function(req, res, next) {
  res.json(
    {
      version: 1.0,
      is_admin: req.session.is_admin
    });
});

router.get('/queues', function(req, res, next) {
  if (req.session.is_admin) {
    db.table('queues')
    .select('id', 'name', 'description', db.raw('true AS helper'))
    .then(function(queues) {
      res.json(queues);
    });
  } else {
    db.table('queues')
    .select('id', 'name', 'description', db.raw('IF(user_queues.user_id=' + req.session.user_id + ', true, false) AS helper'))
    .leftJoin('user_queues', 'user_queues.queue_id', 'queues.id')
    .then(function(queues) {
      res.json(queues);
    });
  }

})

module.exports = router;
