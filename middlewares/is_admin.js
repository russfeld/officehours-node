// Load Model
var User = require('../models/user')

async function is_admin(req, res, next) {
  if (req.session.is_admin === undefined) {
    var roles = await User.relatedQuery('roles')
      .for(req.session.user_id)
      .select('name')
    //Roles for current user
    //console.log(roles)
    if (roles.some((r) => r.name === 'admin')) {
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
