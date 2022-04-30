// Load CAS
var cas = require('../configs/cas')

// Load Database
//var db = require('../configs/db')

// Load Model
var User = require('../models/user')

async function is_admin(req, res, next) {
  if (req.session.is_admin == undefined) {
    roles = await User.relatedQuery('roles')
      .for(User.query().first({ eid: req.session[cas.session_name] }))
      .select('name')
    console.log(roles)
    if (roles.some(r => r.name === 'admin')) {
      req.session.is_admin = true
    } else {
      req.session.is_admin = false
    }
    next()
  } else {
    next()
  }
}

module.exports = is_admin
