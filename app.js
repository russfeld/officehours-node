//Require Libraries
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const debug = require('debug')('app')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const history = require('connect-history-api-fallback')
const util = require('node:util')

// Logger
const logger = require('./configs/logger')

// Default Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Load Environment Variable
require('dotenv').config()
debug('Environment:\n' + process.env)

// Configure Timezone
process.env.TZ = 'UTC'

// Load Configs
const session = require('./configs/session')

// Load Routers
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const apiRouter = require('./routes/api')

// Create Express Application
const app = express()

// Set up Sessions
app.use(session)

// Enable CORS in development
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:3001',
      credentials: true,
    })
  )
}

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Logging middleware is added in routers
// to capture user ID information from token

// JSON Middleware
app.use(express.json())

// Handle URLEncoded Bodies
app.use(express.urlencoded({ extended: false }))

// Parse Cookies
app.use(cookieParser())

// Enable Compression
app.use(compression())

// Add Helmet Protection
app.use(helmet())

if (process.env.NODE_ENV == 'development') {
  app.use('/', indexRouter)
}

// Routers
// Auth routes must come first
app.use('/auth', authRouter)

// Redirect other requests to Vue app
app.use(history())

// Serve Static Resources
app.use(express.static(path.join(__dirname, 'public')))

// Handle any API routes last
app.use('/api/v1', apiRouter)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  logger.error(util.inspect(err))
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
