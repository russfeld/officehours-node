// Load Models
const Request = require('../models/request')
const Queue = require('../models/queue')

const registerQueueHandlers = (io, socket) => {
  const connectQueue = async (id, callback) => {
    const queues = await Queue.query()
      .withGraphJoined('users')
      .where('queues.id', id)
    if (queues.length > 0) {
      const queue = queues[0]
      if (queue.is_open) {
        console.log(socket.data.user_id + ' connecting to queue ' + id)
        socket.data.queue_id = id
        if (
          socket.data.is_admin ||
          queue.users.some((user) => user.id === socket.data.user_id)
        ) {
          socket.data.is_helper = true
          console.log(socket.data.user_id + ' is helper on queue ' + id)
        }
        socket.join('queue-' + id)
        callback(200)
        return
      }
    }
    console.log(socket.data.user_id + ' unable to join queue ' + id)
    socket.disconnect(true)
    callback(404)
  }

  const joinQueue = async (callback) => {
    const queues = await Queue.query().where('queues.id', socket.data.queue_id)
    if (queues.length > 0) {
      const queue = queues[0]
      if (queue.is_open) {
        if (!socket.data.is_helper) {
          var request = await Request.query()
            .where('user_id', socket.data.user_id)
            .where('queue_id', socket.data.queue_id)
            .first()
          if (!request) {
            request = await Request.query().insert({
              user_id: socket.data.user_id,
              queue_id: socket.data.queue_id,
              status_id: 1,
            })
            socket.to('queue-' + socket.data.queue_id).emit('queue:update')
          }
          callback(200)
          return
        } else {
          //helper cannot join queue
          callback(403)
          return
        }
      } else {
        // queue is closed
        callback(403)
        return
      }
    }
    // queue not found
    callback(404)
    return
  }

  const closeQueue = async (callback) => {
    const queues = await Queue.query()
      .withGraphJoined('users')
      .where('queues.id', socket.data.queue_id)
    if (queues.length > 0) {
      const queue = queues[0]
      if (queue.is_open) {
        if (socket.data.is_helper) {
          console.log(
            socket.data.user_id + ' closing queue ' + socket.data.queue_id
          )
          socket.to('queue-' + socket.data.queue_id).emit('queue:closing')
          await Request.query().delete().where('queue_id', socket.data.queue_id)
          await Queue.query()
            .findById(socket.data.queue_id)
            .patch({ is_open: 0 })
          // TODO: close all sockets on queue!
          callback(200)
          return
        }
      }
    }
    console.log(
      socket.data.user_id + ' unable to close queue ' + socket.data.queue_id
    )
    callback(404)
  }

  socket.on('queue:connect', connectQueue)
  socket.on('queue:join', joinQueue)
  socket.on('queue:close', closeQueue)
}

module.exports = registerQueueHandlers
