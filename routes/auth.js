// Load Libraries
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Load Configurations
var cas = require('../configs/cas')
const requestLogger = require('../middlewares/request-logger')

// Load Models
const User = require('../models/user')

// Configure Logging
router.use(requestLogger)

/* Handle Logins */
router.get('/login', async function (req, res, next) {
  if (!req.session.user_id) {
    let eid = ''
    if (req.query.eid && process.env.FORCE_AUTH === 'true') {
      // force authentication enabled, use eID from query
      eid = req.query.eid
    } else {
      // use CAS authentication
      if (req.session[cas.session_name] === undefined) {
        // CAS is not authenticated, so redirect
        // Hack to fix redirects
        req.url = req.originalUrl
        cas.bounce_redirect(req, res, next)
        return
      } else {
        // CAS is authenticated, get eID from session
        eid = req.session[cas.session_name]
      }
    }
    if (eid && eid.length != 0) {
      // Find or Create User for eID
      let user = await User.findOrCreate(eid)
      // Store User ID in session
      req.session.user_id = user.id
      req.session.user_eid = eid
    }
  }
  // Redirect to Homepage
  res.redirect('/')
})

/* Request New JWT */
router.get('/token', async function (req, res, next) {
  if (req.session.user_id) {
    const token = await User.getToken(req.session.user_id)
    res.json({
      token: token,
    })
  } else {
    res.status(401)
    res.json({ error: 'No Session Established, Please Login' })
  }
})

/* Use Refresh Token to Update JWT */
router.post('/token', async function (req, res, next) {
  if (req.body.refresh_token) {
    jwt.verify(
      req.body.refresh_token,
      process.env.TOKEN_SECRET,
      async (err, data) => {
        // console.log('Debugging old refresh tokens')
        // console.log(err)
        // console.log(data)
        if (err) {
          res.status(401)
          res.json({ error: 'Error Parsing Token' })
          return
        }
        if (data && data.refresh_token) {
          // If we receive a verified token, see if it is valid in the database
          const user = await User.findByRefreshToken(data.refresh_token)
          if (user != null) {
            // If it is valid, generate a new token and send
            const token = await User.getToken(user.id)
            res.json({
              token: token,
            })
          } else {
            res.status(401)
            res.json({
              error:
                'Refresh Token Not Found in Database, Session Expired, Please Login',
            })
          }
        } else {
          res.status(401)
          res.json({ error: 'Token Data Invalid, Please Login' })
        }
      }
    )
  } else {
    res.status(401)
    res.json({ error: 'Refresh Token Not Found in Request Body' })
  }
})

router.get('/logout', async function (req, res, next) {
  if (req.session.user_id) {
    await User.clearRefreshToken(req.session.user_id)
  }
  if (req.session[cas.session_name]) {
    cas.logout(req, res, next)
  } else {
    req.session.destroy()
    res.redirect('/')
  }
})

module.exports = router
