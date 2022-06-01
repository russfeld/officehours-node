// Load Libraries
const express = require('express')
const router = express.Router()
const { raw } = require('objection')

// Load Models
//var db = require('../configs/db')
const Queue = require('../models/queue')
const User = require('../models/user')
const Role = require('../models/role')

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
    let queues = await Queue.query()
      .select(
        'queues.id',
        'queues.name',
        'queues.snippet',
        'queues.description',
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
        'snippet',
        'description',
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
      //delete queue.users
    }
    res.json(queues)
  }
})

router.post('/queues/:id', async function (req, res, next) {
  if (req.is_admin) {
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
      res.sendStatus(204)
    } catch (error) {
      res.status(422)
      res.json(error)
    }
  } else {
    res.sendStatus(403)
  }
})

router.delete('/queues/:id', async function (req, res, next) {
  if (req.is_admin) {
    try {
      await Queue.query().deleteById(req.params.id)
      res.sendStatus(204)
    } catch (error) {
      res.status(422)
      res.json(error)
    }
  } else {
    res.sendStatus(403)
  }
})

/* Get Users List */
router.get('/users', async function (req, res, next) {
  if (req.is_admin) {
    let users = await User.query()
      .select('users.id', 'users.eid', 'users.name')
      .withGraphJoined('roles')
      .modifyGraph('roles', (builder) => {
        builder.select('roles.id', 'roles.name')
      })
    res.json(users)
  } else {
    res.sendStatus(403)
  }
})

router.post('/users/:id', async function (req, res, next) {
  if (req.is_admin) {
    try {
      // strip out other data from users
      const roles = req.body.user.roles.map(({ id, ...next }) => {
        return {
          id: id,
        }
      })
      await User.query().upsertGraph(
        {
          id: req.params.id,
          name: req.body.user.name,
          contact_info: req.body.user.contact_info,
          roles: roles,
        },
        {
          relate: true,
          unrelate: true,
        }
      )
      res.sendStatus(204)
    } catch (error) {
      res.status(422)
      res.json(error)
    }
  } else {
    res.sendStatus(403)
  }
})

router.delete('/users/:id', async function (req, res, next) {
  if (req.is_admin) {
    try {
      await User.query().deleteById(req.params.id)
      res.sendStatus(204)
    } catch (error) {
      res.status(422)
      res.json(error)
    }
  } else {
    res.sendStatus(403)
  }
})

router.get('/user', async function (req, res, next) {
  let user = await User.query().findById(req.user_id)
  res.json(user)
})

router.post('/user', async function (req, res, next) {
  try {
    await User.query().findById(req.user_id).patch({
      name: req.body.user.name,
      contact_info: req.body.user.contact_info,
    })
    res.sendStatus(204)
  } catch (error) {
    res.status(422)
    res.json(error)
  }
})

/* Get Roles List */
router.get('/roles', async function (req, res, next) {
  if (req.is_admin) {
    let roles = await Role.query().select('id', 'name')
    res.json(roles)
  } else {
    res.sendStatus(403)
  }
})

module.exports = router
