// Load Models
const User = require('../models/user')
const logger = require('../configs/logger')
const Presence = require('../models/presence')
const Queue = require('../models/queue')

// Presence
// https://stackoverflow.com/questions/32134623/socket-io-determine-if-a-user-is-online-or-offline
let users = {}
let helpers = {}
let presences = {}

const registerPresenceHandlers = async (io, socket) => {
  try {
    if (!helpers[socket.data.queue_id]) {
      helpers[socket.data.queue_id] = {}
    }
    if (!users[socket.data.queue_id]) {
      users[socket.data.queue_id] = {}
    }
    if (!presences[socket.data.queue_id]) {
      presences[socket.data.queue_id] = {}
    }
    if (socket.data.is_helper) {
      if (!helpers[socket.data.queue_id][socket.data.user_id]) {
        helpers[socket.data.queue_id][socket.data.user_id] = []
        const helper = await User.query()
          .findById(socket.data.user_id)
          .select('id', 'name')
        logger.presence(
          socket.data.user_eid +
            ' - helper:online - ' +
            socket.data.queue_id +
            ' - ' +
            socket.id
        )
        const queue = await Queue.query()
          .findById(socket.data.queue_id)
          .select('period_id')
        const presence = await Presence.query().insert({
          eid: socket.data.user_eid,
          is_online: 1,
          period_id: queue.period_id,
        })
        presences[socket.data.queue_id][socket.data.user_id] = presence.id
        socket.to('queue-' + socket.data.queue_id).emit('helper:online', helper)
        io.of('/status').emit('status:update', {
          id: socket.data.queue_id,
          helpers: Object.keys(helpers[String(socket.data.queue_id)]).length,
        })
      } else {
        logger.presence(
          socket.data.user_eid +
            ' - helper:connect - ' +
            socket.data.queue_id +
            ' - ' +
            socket.id
        )
      }
      helpers[socket.data.queue_id][socket.data.user_id].push(socket.id)
    } else {
      if (!users[socket.data.queue_id][socket.data.user_id]) {
        users[socket.data.queue_id][socket.data.user_id] = []
        logger.presence(
          socket.data.user_eid +
            ' - user:online - ' +
            socket.data.queue_id +
            ' - ' +
            socket.id
        )
        socket
          .to('queue-' + socket.data.queue_id)
          .emit('user:online', socket.data.user_id)
      } else {
        logger.presence(
          socket.data.user_eid +
            ' - user:connect - ' +
            socket.data.queue_id +
            ' - ' +
            socket.id
        )
      }
      users[socket.data.queue_id][socket.data.user_id].push(socket.id)
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
    logger.presence('Socket Presence Connection Error: ' + error)
  }

  socket.on('disconnecting', async () => {
    if (socket.data.is_helper) {
      try {
        index = helpers[socket.data.queue_id][socket.data.user_id].findIndex(
          (u) => u === socket.id
        )
        if (index >= 0) {
          helpers[socket.data.queue_id][socket.data.user_id].splice(index, 1)
          if (helpers[socket.data.queue_id][socket.data.user_id].length === 0) {
            logger.presence(
              socket.data.user_eid +
                ' - helper:offline - ' +
                socket.data.queue_id
            )
            await Presence.query()
              .findById(presences[socket.data.queue_id][socket.data.user_id])
              .patch({ is_online: 0 })
            presences[socket.data.queue_id][socket.data.user_id] = null
            socket
              .to('queue-' + socket.data.queue_id)
              .emit('helper:offline', socket.data.user_id)
            delete helpers[socket.data.queue_id][socket.data.user_id]
            io.of('/status').emit('status:update', {
              id: socket.data.queue_id,
              helpers: Object.keys(helpers[String(socket.data.queue_id)])
                .length,
            })
          } else {
            logger.presence(
              socket.data.user_eid +
                ' - helper:disconnect - ' +
                socket.data.queue_id +
                ' - ' +
                socket.id
            )
          }
        } else {
          logger.presence(
            socket.data.user_eid +
              ' - helper:disconnect socket not found - ' +
              socket.id
          )
        }
      } catch (error) {
        logger.presence('Socket Presence Disconnection Error: ' + error)
      }
    } else {
      try {
        var index = users[socket.data.queue_id][socket.data.user_id].findIndex(
          (u) => u === socket.id
        )
        if (index >= 0) {
          users[socket.data.queue_id][socket.data.user_id].splice(index, 1)
          if (users[socket.data.queue_id][socket.data.user_id].length === 0) {
            logger.presence(
              socket.data.user_eid + ' - user:offline - ' + socket.data.queue_id
            )
            socket
              .to('queue-' + socket.data.queue_id)
              .emit('user:offline', socket.data.user_id)
            delete users[socket.data.queue_id][socket.data.user_id]
          } else {
            logger.presence(
              socket.data.user_eid +
                ' - user:disconnect - ' +
                socket.data.queue_id +
                ' - ' +
                socket.id
            )
          }
        } else {
          logger.presence(
            socket.data.user_eid +
              ' - user:disconnect socket not found - ' +
              socket.id
          )
        }
      } catch (error) {
        logger.presence('Socket Presence Disconnection Error: ' + error)
      }
    }
  })
}

const getHelpers = (queue_id) => {
  if (!helpers[String(queue_id)]) return 0
  return Object.keys(helpers[String(queue_id)]).length
}

const stopPeriod = async (queue_id) => {
  if (!presences[queue_id]) return
  for (const helper_id of Object.getOwnPropertyNames(presences[queue_id])) {
    await Presence.query()
      .findById(presences[queue_id][helper_id])
      .patch({ is_online: 0 })
  }
  presences[queue_id] = {}
}

const startPeriod = async (queue_id, period_id) => {
  if (!helpers[String(queue_id)]) return
  const helpersOnline = await User.query()
    .findByIds(Object.getOwnPropertyNames(helpers[queue_id]))
    .select('id', 'eid')
  for (const helper of helpersOnline) {
    const presence = await Presence.query().insert({
      eid: helper.eid,
      is_online: 1,
      period_id: period_id,
    })
    presences[queue_id][helper.id] = presence.id
  }
}

const getPresence = (queue_id, helper_id) => {
  if (!presences[String(queue_id)]) return null
  if (!presences[String(queue_id)][String(helper_id)]) return null
  return presences[String(queue_id)][String(helper_id)]
}

module.exports = {
  registerPresenceHandlers: registerPresenceHandlers,
  getHelpers: getHelpers,
  startPeriod: startPeriod,
  stopPeriod: stopPeriod,
  getPresence: getPresence,
}
