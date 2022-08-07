// Load Libraries
const express = require('express')
const router = express.Router()

// Load Configs
const requestLogger = require('../middlewares/request-logger')

// Load Models
const User = require('../models/user')

// Configure Logging
router.use(requestLogger)

/* GET home page. */
router.get('/', async function (req, res, next) {
  let data = {}
  if (req.session.user_id) {
    const user = await User.query().findById(req.session.user_id)

    if (!user) {
      req.session.destroy()
    } else {
      // check if admin
      const roles = await User.relatedQuery('roles')
        .for(req.session.user_id)
        .select('name')

      data = {
        id: req.session.user_id,
        eid: user.eid,
        name: user.name,
        admin: roles.some((r) => r.name === 'admin'),
      }
    }
  }
  res.render('index', { data: data })
})

module.exports = router
