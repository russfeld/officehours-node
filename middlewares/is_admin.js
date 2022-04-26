// Load CAS
var cas = require('../configs/cas')

// Load Database
var db = require('../configs/db')

function is_admin(req, res, next) {
  if (req.session.is_admin == undefined) {
    db.table('users')
      .where({ eid: req.session[cas.session_name] })
      .join('user_roles', 'users.id', 'user_roles.user_id')
      .join('roles', 'roles.id', 'user_roles.role_id')
      .select('roles.name')
      .pluck('roles.name')
      .then(function (names) {
        if (names.includes('admin')) {
          req.session.is_admin = true
        } else {
          req.session.is_admin = false
        }
        next()
      })
  } else {
    next()
  }
}

module.exports = is_admin
