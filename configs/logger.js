// https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342
const winston = require('winston')

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  socket: 4,
  presence: 5,
  debug: 6,
}

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  if (env === 'test') return 'error'
  return env === 'development' ? 'debug' : 'http'
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  socket: 'blue',
  presence: 'grey',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
)

const transports = [
  new winston.transports.Console(),
  // new winston.transports.File({
  //   filename: 'logs/error.log',
  //   level: 'error',
  // }),
  // new winston.transports.File({ filename: 'logs/all.log' }),
]

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

module.exports = logger
