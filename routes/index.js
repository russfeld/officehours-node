// const { useColors } = require('debug/src/browser')
const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Load CAS
var cas = require('../configs/cas')
const User = require('../models/user')

/* GET home page. */
router.get('/', async function (req, res, next) {
  let data = {}
  if (req.session.user_id) {
    const user = await User.query().findById(req.session.user_id)
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
  res.render('index', { data: data })
})

router.get('/login', async function (req, res, next) {
  if (!req.session.user_id) {
    let eid = ''
    if (req.query.eid && process.env.FORCE_AUTH === 'true') {
      // force authentication enabled
      eid = req.query.eid
    } else {
      // use CAS authentication
      if (req.session[cas.session_name] === undefined) {
        cas.bounce_redirect(req, res, next)
        return
        //res.status(401)
      } else {
        eid = req.session[cas.session_name]
      }
    }
    if (eid && eid.length != 0) {
      let user = await User.findOrCreate(eid)
      // let user = await User.query().where('eid', eid).limit(1)
      // // user not found - create user
      // if (user.length === 0) {
      //   user = await User.query().insert({
      //     eid: eid,
      //     name: eid,
      //   })
      // }
      req.session.user_id = user.id
    }
  }
  // res.json({
  //   token: jwt.sign(
  //     { user_id: req.session.user_id },
  //     process.env.TOKEN_SECRET,
  //     {
  //       expiresIn: '3h',
  //     }
  //   ),
  // })
  res.redirect('/')
})

router.get('/token', async function (req, res, next) {
  if (req.session.user_id) {
    const token = crypto.randomBytes(32).toString('hex')
    await User.query().findById(req.session.user_id).patch({
      refresh_token: token,
    })
    res.json({
      token: jwt.sign(
        {
          user_id: req.session.user_id,
          refresh_token: token,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '30m',
        }
      ),
    })
  } else {
    res.status(401)
    res.send()
  }
})

router.post('/token', async function (req, res, next) {
  if (req.body.refresh_token) {
    const user = await User.findByRefreshToken(req.body.refresh_token)
    if (user != null) {
      const token = crypto.randomBytes(32).toString('hex')
      await User.query().findById(user.id).patch({
        refresh_token: token,
      })
      res.json({
        token: jwt.sign(
          {
            user_id: user.id,
            refresh_token: token,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: '30m',
          }
        ),
      })
    } else {
      res.status(401)
      res.send()
    }
  } else {
    res.status(401)
    res.send()
  }
})

router.get('/cas_login', async function (req, res, next) {
  if (req.session[cas.session_name] === undefined) {
    cas.bounce_redirect(req, res, next)
    return
  } else {
    let eid = req.session[cas.session_name]
    if (eid && eid.length != 0) {
      let user = await User.findOrCreate(eid)
      req.session.user_id = user.id
    }
  }
  res.redirect('/')
})

router.get('/logout', function (req, res, next) {
  if (req.session[cas.session_name]) {
    cas.logout(req, res, next)
  } else {
    req.session.destroy()
    res.redirect('/')
  }
})

// router.get('/token', function (req, res, next) {
//   if (req.session.user_id) {
//     res.json({
//       token: jwt.sign({ user_id: req.session.user_id }, process.env.TOKEN_SECRET, {
//         expiresIn: '3h',
//       })
//     })
//   } else {
//     res.status(401)
//   }
// })

// router.get('/cas_test', cas.bounce, function (req, res, next) {
//   //res.json(req.session[cas.session_name])
//   res.json([req.session[cas.session_name], req.session[cas.session_info]])
// })

module.exports = router
