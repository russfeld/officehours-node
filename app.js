//Require Libraries
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const debug = require('debug')('app')

// Default Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Load Environment constiables
require('dotenv').config()
debug('Environment:\n' + process.env)

// Load Configs
const mysql_session = require('./configs/mysql_session')

// Load Routers
const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')

// Create Express Application
const app = express()

// Set up MySQL Session
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mysql_session,
  })
)

// View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Configure Logging
// https://stackoverflow.com/questions/60129677/how-to-disable-morgan-request-logger-during-unit-test
app.use(logger('dev', { skip: () => process.env.NODE_ENV === 'test' }))

// JSON Middleware
app.use(express.json())

// Handle URLEncoded Bodies
app.use(express.urlencoded({ extended: false }))

// Parse Cookies
app.use(cookieParser())

// Serve Static Resources
app.use(express.static(path.join(__dirname, 'public')))

// Routers
app.use('/', indexRouter)
app.use('/api/v1', apiRouter)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
