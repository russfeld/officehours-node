// Load Models
const Queue = require('../models/queue')
const logger = require('../configs/logger')
const { getHelpers } = require('./presence')

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
        helpers: getHelpers(queue.id),
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
