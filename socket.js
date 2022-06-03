const { Server } = require('socket.io')
const registerQueueHandlers = require('./sockets/queues')

const io = new Server({
  cors: {
    origin: 'http://localhost:3001',
  },
})

const tokenMiddleware = (socket, next) => {
  console.log('Socket Middleware')
  console.log('Token ' + socket.handshake.auth.token)
  next()
}

const connectionEvent = (socket) => {
  console.log('Socket Connected!')
  registerQueueHandlers(io, socket)
}

io.use(tokenMiddleware)

io.on('connection', connectionEvent)

module.exports = io
