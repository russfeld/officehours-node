const { Server } = require('socket.io')
const registerQueueHandlers = require('./sockets/queues')
const socketToken = require('./middlewares/socket-token')

const io = new Server({
  cors: {
    origin: 'http://localhost:3001',
  },
})

const connectionEvent = (socket) => {
  registerQueueHandlers(io, socket)
}

io.use(socketToken)
io.on('connection', connectionEvent)

module.exports = io
