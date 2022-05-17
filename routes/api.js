// Load Libraries
const express = require('express')
const router = express.Router()
const { raw } = require('objection')

// Load Models
//var db = require('../configs/db')
const Queue = require('../models/queue')

// Load Token Middleware
var token = require('../middlewares/token')
router.use(token)

/* GET API Version and User Details */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

/* Get Queues List */
router.get('/queues', async function (req, res, next) {
  if (req.is_admin) {
    let queues = await Queue.query().select(
      'id',
      'name',
      'snippet',
      'description',
      raw('true AS helper')
    )
    res.json(queues)
  } else {
    let queues = await Queue.query()
      .select(
        'queues.id',
        'queues.name',
        'snippet',
        'description',
        raw('IF(users_join.user_id=' + req.user_id + ', true, false) AS helper')
      )
      .joinRelated('users')
    res.json(queues)
  }
})

module.exports = router
