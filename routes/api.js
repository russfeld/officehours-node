var express = require('express')
var router = express.Router()

// Load Database
var db = require('../configs/db')

// Load Token Middleware
var token = require('../middlewares/token')
router.use(token)

/* GET API Version. */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

router.get('/queues', function (req, res, next) {
  if (req.is_admin) {
    db.table('queues')
      .select('id', 'name', 'description', db.raw('true AS helper'))
      .then(function (queues) {
        res.json(queues)
      })
  } else {
    db.table('queues')
      .select(
        'id',
        'name',
        'description',
        db.raw(
          'IF(user_queues.user_id=' + req.user_id + ', true, false) AS helper'
        )
      )
      .leftJoin('user_queues', 'user_queues.queue_id', 'queues.id')
      .then(function (queues) {
        res.json(queues)
      })
  }
})

module.exports = router
