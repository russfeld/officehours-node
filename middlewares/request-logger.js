// https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342
const morgan = require('morgan')
const logger = require('../configs/logger')

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream = {
  // Use the http severity
  write: (message) =>
    logger.http(message.substring(0, message.lastIndexOf('\n'))),
}

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env === 'test'
}

// Build the morgan middleware
const requestLogger = morgan('short', { stream, skip })

morgan.token('remote-user', function (req) {
  if (req.user_eid) {
    return 't:' + req.user_eid
  } else {
    if (req.session && req.session.user_eid) {
      return 's:' + req.session.user_eid
    }
  }
  return '-'
})

module.exports = requestLogger
