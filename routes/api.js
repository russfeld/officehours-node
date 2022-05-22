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
      raw('true AS helper'),
      raw('true AS editable')
    )
    res.json(queues)
  } else {
    let queues = await Queue.query()
      .select(
        'queues.id',
        'queues.name',
        'snippet',
        'description',
        raw(
          'IF(users_join.user_id=' + req.user_id + ', true, false) AS helper'
        ),
        raw('false AS editable')
      )
      .joinRelated('users')
    res.json(queues)
  }
})

router.post('/queues/:id/edit', async function (req, res, next) {
  if (req.is_admin) {
    try {
      await Queue.query().findById(req.params.id).patch({
        name: req.body.queue.name,
        snippet: req.body.queue.snippet,
        description: req.body.queue.description,
      })
      res.sendStatus(204)
    } catch (error) {
      res.status(422)
      res.json(error)
    }
  } else {
    res.sendStatus(403)
  }
})

module.exports = router
