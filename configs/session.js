var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)

var options = {
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}

var mysql_store = new MySQLStore(options)

var mysql_session = session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mysql_store,
})

module.exports = mysql_session
