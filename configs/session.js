const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const db = require('./db')

const store = new KnexSessionStore({
  knex: db
})

const knex_session = session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
})

module.exports = knex_session