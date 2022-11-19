// Load Models
const Request = require('../models/request')
const Queue = require('../models/queue')
const Period = require('../models/period')
const Event = require('../models/event')
const { startPeriod, stopPeriod, getPresence } = require('./presence')
const logger = require('../configs/logger')
const User = require('../models/user')

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
      const queue = await Queue.query()
        .findById(socket.data.queue_id)
        .select('period_id', 'is_open')
      if (queue.is_open == 1) {
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
          // TODO this is ineffecient and in multiple places
          await Event.query().patch({}).whereNull('updated_at').andWhere({
            eid: socket.data.user_eid,
            period_id: queue.period_id,
          })
          await Event.query().insert({
            eid: socket.data.user_eid,
            status: 'Queued',
            period_id: queue.period_id,
          })
        }
        emitQueueUpdate(socket.data.queue_id, request.id)
        callback(200)
        return
      }
    }
    callback(403)
  }

  const takeRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      const queue = await Queue.query()
        .findById(socket.data.queue_id)
        .select('period_id', 'is_open')
      if (queue.is_open == 1) {
        logger.socket(
          socket.data.user_eid +
            ' - request:take - ' +
            socket.data.queue_id +
            ' - ' +
            id
        )
        try {
          const request = await Request.query().patchAndFetchById(id, {
            status_id: 2,
            helper_id: socket.data.user_id,
          })
          const user = await User.query()
            .findById(request.user_id)
            .select('eid')
          await Event.query().patch({}).whereNull('updated_at').andWhere({
            eid: user.eid,
            period_id: queue.period_id,
          })
          await Event.query().insert({
            eid: user.eid,
            status: 'Taken',
            period_id: queue.period_id,
            presence_id: getPresence(socket.data.queue_id, socket.data.user_id),
          })
          emitQueueUpdate(socket.data.queue_id, id)
          callback(200)
        } catch (e) {
          logger.socket(e.stack)
          callback(500)
        }
        return
      }
    }
    callback(403)
  }

  const deleteRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      const queue = await Queue.query()
        .findById(socket.data.queue_id)
        .select('period_id', 'is_open')
      if (queue.is_open == 1) {
        logger.socket(
          socket.data.user_eid +
            ' - request:delete - ' +
            socket.data.queue_id +
            ' - ' +
            id
        )
        try {
          const request = await Request.query().patchAndFetchById(id, {
            status_id: 5,
          })
          const user = await User.query()
            .findById(request.user_id)
            .select('eid')
          await Event.query().patch({}).whereNull('updated_at').andWhere({
            eid: user.eid,
            period_id: queue.period_id,
          })
          await Event.query().insert({
            eid: user.eid,
            status: 'Deleted',
            period_id: queue.period_id,
            presence_id: getPresence(socket.data.queue_id, socket.data.user_id),
          })
          emitQueueRemove(socket.data.queue_id, id)
          callback(200)
        } catch (e) {
          logger.socket(e.stack)
          callback(500)
        }
        return
      }
    }
    callback(403)
  }

  const finishRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      const queue = await Queue.query()
        .findById(socket.data.queue_id)
        .select('period_id', 'is_open')
      if (queue.is_open == 1) {
        logger.socket(
          socket.data.user_eid +
            ' - request:finish - ' +
            socket.data.queue_id +
            ' - ' +
            id
        )
        try {
          const request = await Request.query().patchAndFetchById(id, {
            status_id: 3,
          })
          const queue = await Queue.query()
            .findById(socket.data.queue_id)
            .select('period_id')
          const user = await User.query()
            .findById(request.user_id)
            .select('eid')

          await Event.query().insert({
            eid: user.eid,
            status: 'Finished',
            period_id: queue.period_id,
            presence_id: getPresence(socket.data.queue_id, socket.data.user_id),
          })
          await Event.query().patch({}).whereNull('updated_at').andWhere({
            eid: user.eid,
            period_id: queue.period_id,
          })
          emitQueueRemove(socket.data.queue_id, id)
          callback(200)
        } catch (e) {
          logger.socket(e.stack)
          callback(500)
        }
        return
      }
    }
    callback(403)
  }

  const requeueRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      const queue = await Queue.query()
        .findById(socket.data.queue_id)
        .select('period_id', 'is_open')
      if (queue.is_open == 1) {
        logger.socket(
          socket.data.user_eid +
            ' - request:requeue - ' +
            socket.data.queue_id +
            ' - ' +
            id
        )
        try {
          // Remove old request
          const oldRequest = await Request.query().patchAndFetchById(id, {
            status_id: 4,
          })
          const queue = await Queue.query()
            .findById(socket.data.queue_id)
            .select('period_id')
          const user = await User.query()
            .findById(oldRequest.user_id)
            .select('eid')
          await Event.query().insert({
            eid: user.eid,
            status: 'Requeued',
            period_id: queue.period_id,
            presence_id: getPresence(socket.data.queue_id, socket.data.user_id),
          })
          emitQueueRemove(socket.data.queue_id, id)
          // Enqueue new request
          const request = await Request.query().insertAndFetch({
            user_id: oldRequest.user_id,
            queue_id: socket.data.queue_id,
            status_id: 1,
          })
          await Event.query().patch({}).whereNull('updated_at').andWhere({
            eid: user.eid,
            period_id: queue.period_id,
          })
          await Event.query().insert({
            eid: user.eid,
            status: 'Queued',
            period_id: queue.period_id,
          })
          emitQueueUpdate(socket.data.queue_id, request.id)
          callback(200)
        } catch (e) {
          logger.socket(e.stack)
          callback(500)
        }
        return
      }
    }
    callback(403)
  }

  const openQueue = async (callback) => {
    if (socket.data.is_helper) {
      logger.socket(
        socket.data.user_eid + ' - queue:open - ' + socket.data.queue_id
      )
      const queue = await Queue.query().findById(socket.data.queue_id)
      const period = await Period.query().insert({
        queue_name: queue.name,
        is_open: 1,
      })
      startPeriod(socket.data.queue_id, period.id)
      await queue.$query().patch({ is_open: 1, period_id: period.id })
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
      await Request.query().delete().where('queue_id', socket.data.queue_id)
      const queue = await Queue.query().findById(socket.data.queue_id)
      await Period.query().findById(queue.period_id).patch({ is_open: 0 })
      stopPeriod(socket.data.queue_id)
      await queue.$query().patch({ is_open: 0, period_id: null })
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
