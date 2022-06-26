// Load Libraries
const express = require('express')
const router = express.Router()
const { raw } = require('objection')

// Load Middleware
const adminOnly = require('../../middlewares/admin_only')

// Load Models
const Queue = require('../../models/queue')

/* Get Whole Queues List */
router.get('/', async function (req, res, next) {
  if (req.is_admin) {
    let queues = await Queue.query()
      .select(
        'queues.id',
        'queues.name',
        'queues.snippet',
        'queues.description',
        'queues.is_open',
        raw('true AS helper'),
        raw('true AS editable')
      )
      .withGraphJoined('users')
      .modifyGraph('users', (builder) => {
        builder.select('users.id', 'users.eid')
      })
    res.json(queues)
  } else {
    let queues = await Queue.query()
      .select(
        'queues.id',
        'queues.name',
        'queues.snippet',
        'queues.description',
        'queues.is_open',
        raw('false AS editable')
      )
      .withGraphJoined('users')
      .modifyGraph('users', (builder) => {
        builder.select('users.id')
      })
    for (const queue of queues) {
      if (queue.users.some((user) => user.id === req.user_id)) {
        queue['helper'] = 1
      } else {
        queue['helper'] = 0
      }
      delete queue.users
    }
    res.json(queues)
  }
})

/* Update Single Queue */
router.post('/:id', adminOnly, async function (req, res, next) {
  try {
    // strip out other data from users
    const users = req.body.queue.users.map(({ id, ...next }) => {
      return {
        id: id,
      }
    })
    await Queue.query().upsertGraph(
      {
        id: req.params.id,
        name: req.body.queue.name,
        snippet: req.body.queue.snippet,
        description: req.body.queue.description,
        users: users,
      },
      {
        relate: true,
        unrelate: true,
      }
    )
    res.status(200)
    res.json({ message: 'Queue Saved' })
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/* Delete Single Queue */
router.delete('/:id', adminOnly, async function (req, res, next) {
  try {
    var deleted = await Queue.query().deleteById(req.params.id)
    if (deleted === 1) {
      res.status(200)
      res.json({ message: 'Queue Deleted' })
    } else {
      res.status(422)
      res.json({ error: 'Queue Not Found' })
    }
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/* Create New Queue */
router.put('/', adminOnly, async function (req, res, next) {
  try {
    const inserted = await Queue.query().insert({
      name: req.body.name,
    })
    res.status(201)
    res.json(inserted)
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

module.exports = router
