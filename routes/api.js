// Load Libraries
const express = require('express')
const router = express.Router()

// Load Routers
const queueRouter = require('./api/queues')

// Load Models
const User = require('../models/user')
const Role = require('../models/role')

// Load Token Middleware
var token = require('../middlewares/token')
router.use(token)

router.use('/queues', queueRouter)

/* GET API Version and User Details */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

/* Get Users List */
router.get('/users', async function (req, res, next) {
  if (req.is_admin) {
    let users = await User.query()
      .select('users.id', 'users.eid', 'users.name', 'users.contact_info')
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

router.put('/users', async function (req, res, next) {
  if (req.is_admin) {
    try {
      const user = await User.findOrCreate(req.body.eid)
      res.status(201)
      res.json(user)
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
    if (req.params.id == req.user_id) {
      res.sendStatus(422)
    }
    try {
      var deleted = await User.query().deleteById(req.params.id)
      if (deleted === 1) {
        res.sendStatus(204)
      } else {
        res.sendStatus(422)
      }
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
