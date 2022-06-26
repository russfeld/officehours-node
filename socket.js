const { Server } = require('socket.io')
const registerQueueHandlers = require('./sockets/queues')
const socketToken = require('./middlewares/socket-token')
const socketQueue = require('./middlewares/socket-queue')

const io = new Server({
  cors: {
    origin: 'http://localhost:3001',
  },
})

const connectionEvent = (socket) => {
  registerQueueHandlers(io, socket)
}

io.use(socketToken)
io.use(socketQueue)
io.on('connection', connectionEvent)

// Presence
// https://stackoverflow.com/questions/32134623/socket-io-determine-if-a-user-is-online-or-offline
let users = {}

io.on('connection', (socket) => {
  try {
    if (!users[socket.data.queue_id]) {
      users[socket.data.queue_id] = {}
    }
    if (!users[socket.data.queue_id][socket.data.user_id]) {
      users[socket.data.queue_id][socket.data.user_id] = []
    }
    users[socket.data.queue_id][socket.data.user_id].push(socket.id)
    //console.log(socket.data.user_id + " online on queue " + socket.data.queue_id)
    io.to('queue-' + socket.data.queue_id).emit(
      'user:online',
      socket.data.user_id
    )
    socket.emit(
      'connected',
      Object.getOwnPropertyNames(users[socket.data.queue_id])
    )
  } catch (error) {
    // TODO error handling
    //console.log("error connect")
    //console.log(error)
  }

  socket.on('disconnecting', () => {
    try {
      var index = users[socket.data.queue_id][socket.data.user_id].findIndex(
        (u) => u === socket.id
      )
      if (index >= 0) {
        users[socket.data.queue_id][socket.data.user_id].splice(index, 1)
      } else {
        //console.log("socket disconnect - socket not found")
      }
      //console.log(socket.data.user_id + " offline on queue " + socket.data.queue_id)
      if (users[socket.data.queue_id][socket.data.user_id].length === 0) {
        socket
          .to('queue-' + socket.data.queue_id)
          .emit('user:offline', socket.data.user_id)
      } else {
        //console.log("socket disconnect - user still has sockets")
      }
    } catch (error) {
      // TODO error handling
      //console.log("error disconnect")
      //console.log(error)
    }
  })
})

module.exports = io
