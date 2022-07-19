// Load Models
const Request = require('../models/request')
const Queue = require('../models/queue')
const logger = require('../configs/logger')

const registerQueueHandlers = (io, socket) => {
  const connectQueue = async (callback) => {
    logger.socket(
      socket.data.user_eid + ' - queue:connect - ' + socket.data.queue_id
    )
    const requests = await Request.query()
      .where('queue_id', socket.data.queue_id)
      .where('status_id', '<', 3)
      .withGraphFetched('user')
      .modifyGraph('user', (builder) => {
        builder.select('users.id', 'users.name')
      })
      .withGraphFetched('helper')
      .modifyGraph('helper', (builder) => {
        builder.select('users.id', 'users.name', 'users.contact_info')
      })
    callback(200, requests)
    return
  }

  const joinQueue = async (callback) => {
    if (!socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid + ' - queue:join - ' + socket.data.queue_id
      )
      var request = await Request.query()
        .where('user_id', socket.data.user_id)
        .where('queue_id', socket.data.queue_id)
        .where('status_id', '<', 3)
        .first()
      if (!request) {
        request = await Request.query().insertAndFetch({
          user_id: socket.data.user_id,
          queue_id: socket.data.queue_id,
          status_id: 1,
        })
      }
      emitQueueUpdate(socket.data.queue_id, request.id)
      callback(200)
      return
    }
    callback(403)
  }

  const takeRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid +
          ' - request:take - ' +
          socket.data.queue_id +
          ' - ' +
          id
      )
      await Request.query()
        .findById(id)
        .patch({ status_id: 2, helper_id: socket.data.user_id })
      emitQueueUpdate(socket.data.queue_id, id)
      callback(200)
      return
    }
    callback(403)
  }

  const deleteRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid +
          ' - request:delete - ' +
          socket.data.queue_id +
          ' - ' +
          id
      )
      await Request.query().deleteById(id)
      emitQueueRemove(socket.data.queue_id, id)
      callback(200)
      return
    }
    callback(403)
  }

  const finishRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid +
          ' - request:finish - ' +
          socket.data.queue_id +
          ' - ' +
          id
      )
      await Request.query().findById(id).patch({ status_id: 3 })
      emitQueueRemove(socket.data.queue_id, id)
      callback(200)
      return
    }
    callback(403)
  }

  const requeueRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid +
          ' - request:requeue - ' +
          socket.data.queue_id +
          ' - ' +
          id
      )
      // Remove old request
      const oldRequest = await Request.query().findById(id)
      await oldRequest.$query().patch({ status_id: 4 })
      emitQueueRemove(socket.data.queue_id, id)
      // Enqueue new request
      const request = await Request.query().insertAndFetch({
        user_id: oldRequest.user_id,
        queue_id: socket.data.queue_id,
        status_id: 1,
      })
      emitQueueUpdate(socket.data.queue_id, request.id)
      callback(200)
    }
    callback(403)
  }

  const openQueue = async (callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid + ' - queue:open - ' + socket.data.queue_id
      )
      await Queue.query().findById(socket.data.queue_id).patch({ is_open: 1 })
      socket.to('queue-' + socket.data.queue_id).emit('queue:opening')
      io.of('/status').emit('status:update', {
        id: socket.data.queue_id,
        is_open: 1,
      })
      callback(200)
      return
    }
    callback(403)
  }

  const closeQueue = async (callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid + ' - queue:close - ' + socket.data.queue_id
      )
      // TODO Store Previous Data for Tracking
      await Request.query().delete().where('queue_id', socket.data.queue_id)
      await Queue.query().findById(socket.data.queue_id).patch({ is_open: 0 })
      socket.to('queue-' + socket.data.queue_id).emit('queue:closing')
      io.of('/status').emit('status:update', {
        id: socket.data.queue_id,
        is_open: 0,
      })
      callback(200)
      return
    }
    callback(403)
  }

  const emitQueueUpdate = async (id, request_id) => {
    const request = await Request.query()
      .findById(request_id)
      .withGraphFetched('user')
      .modifyGraph('user', (builder) => {
        builder.select('users.id', 'users.name')
      })
      .withGraphFetched('helper')
      .modifyGraph('helper', (builder) => {
        builder.select('users.id', 'users.name', 'users.contact_info')
      })
    io.to('queue-' + id).emit('queue:update', request)
    statusUpdate(id)
  }

  const emitQueueRemove = async (id, request_id) => {
    io.to('queue-' + id).emit('queue:remove', request_id)
    statusUpdate(id)
  }

  const statusUpdate = async (id) => {
    const count = await Request.query()
      .where('queue_id', id)
      .where('status_id', '<', 3)
      .resultSize()
    io.of('/status').emit('status:update', { id: id, requests: count })
  }

  socket.on('queue:connect', connectQueue)
  socket.on('queue:join', joinQueue)
  socket.on('request:take', takeRequest)
  socket.on('request:delete', deleteRequest)
  socket.on('request:finish', finishRequest)
  socket.on('request:requeue', requeueRequest)
  socket.on('queue:close', closeQueue)
  socket.on('queue:open', openQueue)
}

module.exports = registerQueueHandlers
