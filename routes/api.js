// Load Libraries
const express = require('express')
const router = express.Router()

// Load Routers
const queueRouter = require('./api/queues')
const usersRouter = require('./api/users')

// Load Models
const User = require('../models/user')
const Role = require('../models/role')

// Load Token Middleware
var token = require('../middlewares/token')
router.use(token)

router.use('/queues', queueRouter)
router.use('/users', usersRouter)

/* GET API Version and User Details */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
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
