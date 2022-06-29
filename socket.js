// Load Libraries
const { Server } = require('socket.io')
const registerQueueHandlers = require('./sockets/queues')
const socketToken = require('./middlewares/socket-token')
const socketQueue = require('./middlewares/socket-queue')

// Load Models
const User = require('./models/user')

const io = new Server({
  // TODO Fix CORS when deploy
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
let helpers = {}

io.on('connection', async (socket) => {
  try {
    //console.log(socket.data.user_id + " online on queue " + socket.data.queue_id)
    if (!helpers[socket.data.queue_id]) {
      helpers[socket.data.queue_id] = {}
    }
    if (!users[socket.data.queue_id]) {
      users[socket.data.queue_id] = {}
    }
    if (socket.data.is_helper) {
      if (!helpers[socket.data.queue_id][socket.data.user_id]) {
        helpers[socket.data.queue_id][socket.data.user_id] = []
      }
      helpers[socket.data.queue_id][socket.data.user_id].push(socket.id)
      const helper = await User.query()
        .findById(socket.data.user_id)
        .select('id', 'name')
      socket.to('queue-' + socket.data.queue_id).emit('helper:online', helper)
    } else {
      if (!users[socket.data.queue_id][socket.data.user_id]) {
        users[socket.data.queue_id][socket.data.user_id] = []
      }
      users[socket.data.queue_id][socket.data.user_id].push(socket.id)
      socket
        .to('queue-' + socket.data.queue_id)
        .emit('user:online', socket.data.user_id)
    }
    const helpersOnline = await User.query()
      .findByIds(Object.getOwnPropertyNames(helpers[socket.data.queue_id]))
      .select('id', 'name')
    socket.emit(
      'connected',
      Object.getOwnPropertyNames(users[socket.data.queue_id]),
      helpersOnline
    )
  } catch (error) {
    // TODO error handling
    //console.log("error connect")
    //console.log(error)
  }

  socket.on('disconnecting', () => {
    if (socket.data.is_helper) {
      try {
        index = helpers[socket.data.queue_id][socket.data.user_id].findIndex(
          (u) => u === socket.id
        )
        if (index >= 0) {
          helpers[socket.data.queue_id][socket.data.user_id].splice(index, 1)
        } else {
          //console.log("socket disconnect - socket not found")
        }
        //console.log(socket.data.user_id + " offline on queue " + socket.data.queue_id)
        if (helpers[socket.data.queue_id][socket.data.user_id].length === 0) {
          socket
            .to('queue-' + socket.data.queue_id)
            .emit('helper:offline', socket.data.user_id)
          delete helpers[socket.data.queue_id][socket.data.user_id]
        } else {
          //console.log("socket disconnect - user still has sockets")
        }
      } catch (error) {
        // TODO error handling
        //console.log(error)
      }
    } else {
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
          delete users[socket.data.queue_id][socket.data.user_id]
        } else {
          //console.log("socket disconnect - user still has sockets")
        }
      } catch (error) {
        // TODO error handling
        //console.log(error)
      }
    }
  })
})

module.exports = {
  socket: io,
  users: users,
  helpers: helpers,
}
