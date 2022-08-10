// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Period = require('../../models/period')
const Event = require('../../models/event')
const Presence = require('../../models/presence')

// Require Admin Role on All Routes
router.use(adminOnly)

/* Get Queue Names */
router.get('/', async function (req, res, next) {
  if (req.query.name) {
    let periods = await Period.query()
      .select(
        'id',
        'created_at',
        'updated_at',
        Period.relatedQuery('events').count().as('events')
      )
      .where('queue_name', req.query.name)
    res.json(periods)
  } else {
    let queues = await Period.query()
      .max('created_at as recent')
      .count('id as periods')
      .select('queue_name')
      .groupBy('queue_name')
    res.json(queues)
  }
})

router.get('/:id', async function (req, res, next) {
  let events = await Event.query()
    .select(
      'events.id',
      'events.eid',
      'status',
      'events.created_at',
      'events.updated_at'
    )
    .where('events.period_id', req.params.id)
    .withGraphJoined('presence')
    .modifyGraph('presences', (builder) => {
      builder.select('presences.eid')
    })
  let presences = await Presence.query()
    .select('id', 'eid', 'created_at', 'updated_at')
    .where('period_id', req.params.id)
  res.json({
    events: events,
    presences: presences,
  })
})

module.exports = router
