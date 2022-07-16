// Load Models
const Queue = require('../models/queue')
const logger = require('../configs/logger')
const { helpers } = require('./presence')

const registerStatusHandlers = (io, socket) => {
  const connectStatus = async (callback) => {
    let queues = await Queue.query()
      .select('queues.id', 'queues.is_open')
      .withGraphJoined('requests')
      .modifyGraph('requests', (builder) => {
        builder.select('requests.id')
        builder.where('requests.status_id', '<', 3)
      })
    var online = []
    for (const queue of queues) {
      online.push({
        id: queue.id,
        is_open: queue.is_open,
        helpers: helpers[String(queue.id)]
          ? Object.keys(helpers[String(queue.id)]).length
          : 0,
        requests: queue.requests.length,
      })
    }
    logger.socket(socket.data.user_eid + ' status:connect')
    callback(200, online)
    return
  }

  socket.on('status:connect', connectStatus)
}

module.exports = registerStatusHandlers
