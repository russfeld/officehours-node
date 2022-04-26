// Load CAS
var cas = require('../configs/cas')

// Load Database
var db = require('../configs/db')

function user_id(req, res, next) {
  if (req.session.user_id == undefined) {
    db.table('users')
      .where({ eid: req.session[cas.session_name] })
      .first()
      .then(function (user) {
        req.session.user_id = user.id
        next()
      })
  } else {
    next()
  }
}

module.exports = user_id
