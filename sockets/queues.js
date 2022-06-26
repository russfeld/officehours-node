// Load Models
const Request = require('../models/request')
const Queue = require('../models/queue')

const registerQueueHandlers = (io, socket) => {
  const connectQueue = async (callback) => {
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
        //socket.to('queue-' + socket.data.queue_id).emit('queue:update')
      }
      emitQueueUpdate(socket.data.queue_id, request.id)
      callback(200)
      return
    }
    callback(403)
  }

  const takeRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      // console.log(socket.data.user_id + ' taking request ' + id)
      await Request.query()
        .findById(id)
        .patch({ status_id: 2, helper_id: socket.data.user_id })
      emitQueueUpdate(socket.data.queue_id, id)
      //socket.to('queue-' + socket.data.queue_id).emit('queue:update')
      callback(200)
      return
    }
    callback(403)
  }

  const deleteRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      // console.log(socket.data.user_id + ' deleting request ' + id)
      await Request.query().deleteById(id)
      emitQueueRemove(socket.data.queue_id, id)
      //socket.to('queue-' + socket.data.queue_id).emit('queue:update')
      callback(200)
      return
    }
    callback(403)
  }

  const finishRequest = async (id, callback) => {
    if (socket.data.is_helper) {
      // console.log(socket.data.user_id + ' finishing request ' + id)
      await Request.query().findById(id).patch({ status_id: 3 })
      emitQueueRemove(socket.data.queue_id, id)
      //socket.to('queue-' + socket.data.queue_id).emit('queue:update')
      callback(200)
      return
    }
    callback(403)
  }

  const openQueue = async (callback) => {
    if (socket.data.is_helper) {
      // console.log(
      //   socket.data.user_id + ' opening queue ' + socket.data.queue_id
      // )
      await Queue.query().findById(socket.data.queue_id).patch({ is_open: 1 })
      socket.to('queue-' + socket.data.queue_id).emit('queue:opening')
      callback(200)
      return
    }
    callback(403)
  }

  const closeQueue = async (callback) => {
    if (socket.data.is_helper) {
      // console.log(
      //   socket.data.user_id + ' closing queue ' + socket.data.queue_id
      // )
      await Request.query().delete().where('queue_id', socket.data.queue_id)
      await Queue.query().findById(socket.data.queue_id).patch({ is_open: 0 })
      socket.to('queue-' + socket.data.queue_id).emit('queue:closing')
      // TODO: close all sockets on queue!
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
  }

  const emitQueueRemove = async (id, request_id) => {
    io.to('queue-' + id).emit('queue:remove', request_id)
  }

  socket.on('queue:connect', connectQueue)
  socket.on('queue:join', joinQueue)
  socket.on('request:take', takeRequest)
  socket.on('request:delete', deleteRequest)
  socket.on('request:finish', finishRequest)
  socket.on('queue:close', closeQueue)
  socket.on('queue:open', openQueue)
}

module.exports = registerQueueHandlers
