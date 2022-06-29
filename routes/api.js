// Load Libraries
const express = require('express')
const router = express.Router()

// Load Middleware
var token = require('../middlewares/token')
const requestLogger = require('../middlewares/request-logger')

// Load Routers
const queueRouter = require('./api/queues')
const usersRouter = require('./api/users')
const profileRouter = require('./api/profile')
const roleRouter = require('./api/roles')

// Load Token Middleware
router.use(token)

// Configure Logging (after token)
router.use(requestLogger)

router.use('/queues', queueRouter)
router.use('/users', usersRouter)
router.use('/profile', profileRouter)
router.use('/roles', roleRouter)

/* GET API Version and User Details */
router.get('/', function (req, res, next) {
  res.json({
    version: 1.0,
    user_id: req.user_id,
    is_admin: req.is_admin ? 1 : 0,
  })
})

module.exports = router
