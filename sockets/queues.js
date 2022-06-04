// Load Models
const Request = require('../models/request')
const Queue = require('../models/queue')

const registerQueueHandlers = (io, socket) => {
  const joinQueue = async (id, callback) => {
    const queues = await Queue.query()
      .withGraphJoined('users')
      .where('queues.id', id)
    if (queues.length > 0) {
      const queue = queues[0]
      if (queue.is_open) {
        console.log(socket.data.user_id + " joining queue " + id)
        socket.data.queue_id = id
        if (queue.users.some((user) => user.id === socket.data.user_id)) {
          socket.data.is_helper = true
          console.log(socket.data.user_id + " is helper on queue " + id)
        } else {
          var request = await Request.query().where("user_id", socket.data.user_id).where("queue_id", id).first()
          if(!request) {
            request = await Request.query().insert({
              user_id: socket.data.user_id,
              queue_id: id,
              status_id: 1
            })
          }
        }
        socket.join("queue-" + id)
        callback(200)
        return;
      }
    }
    console.log(socket.data.user_id + " unable to join queue " + id)
    callback(404)
  }

  // const method = (payload) => {

  // }

  socket.on('queue:join', joinQueue)
}

module.exports = registerQueueHandlers
