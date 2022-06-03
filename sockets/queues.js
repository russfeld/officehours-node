const registerQueueHandlers = (io, socket) => {
  const joinQueue = (payload) => {
    console.log('Queue join' + payload)
  }

  // const method = (payload) => {

  // }

  socket.on('queue:join', joinQueue)
}

module.exports = registerQueueHandlers
