// Load Logger
const logger = require('../configs/logger')

// Load Models
const Queue = require('../models/queue')

async function socketQueue(socket, next) {
  const id = socket.handshake.auth.queue_id
  const queues = await Queue.query()
    .withGraphJoined('users')
    .where('queues.id', id)
  if (queues.length > 0) {
    const queue = queues[0]
    logger.socket(socket.data.user_eid + ' - connecting - ' + id)
    socket.data.queue_id = id
    if (
      socket.data.is_admin ||
      queue.users.some((user) => user.id === socket.data.user_id)
    ) {
      socket.data.is_helper = true
      logger.socket(socket.data.user_eid + ' - helper - ' + id)
    }
    socket.join('queue-' + id)
    next()
    return
  }
  logger.socket(socket.data.user_eid + ' - connect_error - ' + id)
  next(new Error('Queue Join Error'))
}

module.exports = socketQueue
