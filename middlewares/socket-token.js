const jwt = require('jsonwebtoken')

// const User = require('../models/user')

async function authenticateToken(socket, next) {
  const token = socket.handshake.auth.token

  if (token == null) {
    next(new Error('No Token'))
    return
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        next(new Error('Token Expired'))
        return
      } else {
        next(new Error('Token Parse Error'))
        return
      }
    }

    socket.data.user_id = user.user_id
    // HACK This trusts the JWT signature to give admin privs.
    // See below for a DB method for this - less efficient.
    socket.data.is_admin = user.is_admin

    // // check if admin
    // const roles = await User.relatedQuery('roles')
    //   .for(user.user_id)
    //   .select('name')
    // //Roles for current user
    // //console.log(roles)
    // if (roles.some((r) => r.name === 'admin')) {
    //   socket.data.is_admin = true
    // } else {
    //   socket.data.is_admin = false
    // }

    next()
  })
}

module.exports = authenticateToken
