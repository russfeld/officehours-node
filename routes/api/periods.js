// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
const adminOnly = require('../../middlewares/admin-only')

// Load Models
const Period = require('../../models/period')

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
  let periods = await Period.query()
    .select('id', 'created_at', 'updated_at')
    .where('queue_name', req.params.name)
  res.json(periods)
})

module.exports = router
