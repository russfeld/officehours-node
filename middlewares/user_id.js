// Load CAS
var cas = require('../configs/cas')

// Load Model
var User = require('../models/user')

async function user_id(req, res, next) {
  if (req.session.user_id == undefined) {
    //Authenticated User
    //console.log(req.session[cas.session_name])
    var user = await User.query()
      .where('eid', req.session[cas.session_name])
      .limit(1)
    req.session.user_id = user[0].id
    //Authenticated Users's ID
    //console.log(req.session.user_id)
    next()
  } else {
    next()
  }
}

module.exports = user_id
