// Load Libraries
const { Server } = require('socket.io')
const registerQueueHandlers = require('./sockets/queues')
const { registerPresenceHandlers } = require('./sockets/presence')
const registerStatusHandlers = require('./sockets/status')
const socketToken = require('./middlewares/socket-token')
const socketQueue = require('./middlewares/socket-queue')

var io
if (process.env.NODE_ENV === 'development') {
  io = new Server({
    cors: {
      origin: 'http://localhost:3001',
    },
  })
} else {
  io = new Server()
}

const connectionEvent = async (socket) => {
  registerQueueHandlers(io, socket)
  await registerPresenceHandlers(io, socket)
}

const statusConnectionEvent = async (socket) => {
  registerStatusHandlers(io, socket)
}

io.use(socketToken)
io.use(socketQueue)
io.on('connection', connectionEvent)

io.of('/status').use(socketToken)
io.of('/status').on('connection', statusConnectionEvent)

module.exports = {
  socket: io,
}
