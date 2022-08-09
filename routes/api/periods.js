// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Period = require('../../models/period')
const Event = require('../../models/event')

// Require Admin Role on All Routes
router.use(adminOnly)

/* Get Queue Names */
router.get('/', async function (req, res, next) {
  let queues = await Period.query()
    .max('created_at as recent')
    .count('id as periods')
    .select('queue_name')
    .groupBy('queue_name')
  res.json(queues)
})

/* Get Periods for Queue */
router.get('/:name', async function (req, res, next) {
  const name = decodeURI(req.params.name)
  let periods = await Period.query()
    .select(
      'id',
      'created_at',
      'updated_at',
      Period.relatedQuery('events').count().as('events')
    )
    .where('queue_name', name)
  res.json(periods)
})

router.get('/:id/events', async function (req, res, next) {
  let events = await Event.query()
    .select('id', 'eid', 'status', 'created_at', 'updated_at')
    .where('period_id', req.params.id)
  res.json(events)
})

module.exports = router
