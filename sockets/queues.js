//https://www.linode.com/docs/guides/authenticating-over-websockets-with-jwt/

const ws = require('ws')
const Queue = require('../models/queue')

// Create Web Socket Server
const wss = new ws.WebSocketServer({ noServer: true })

// In-Memory Store of Client Sockets
var sockets = {}

// Test WSS Connections
wss.on('connection', (ws, queue_id) => {
  console.log('Socket Connected!')
  ws.send('You are connected to queue ' + queue_id)
  ws.on('message', (data) => {
    console.log('Message received!')
    console.log('%s', data)
  })
})

// Upgrade Socket Connection
const upgrade = async function (req, socket, head) {
  console.log('Upgrade received!')
  const path = new URL(req.url, 'http://localhost').pathname

  //parse JSON token
  //var token = url.parse(req.url, true).query.token;

  console.log(path)
  const match = /^\/queues\/(\d*)$/gm.exec(path)
  console.log(match)
  if (match) {
    console.log('Queue ID Matched')
    console.log(match[1])
    // we have a queue ID
    const queue = await Queue.query().findById(match[1])
    if (queue && queue.is_open) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        console.log('Handling Upgrade')
        wss.emit('connection', ws, queue.id)
      })
      return
    }
  }

  socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
  socket.destroy()
  return
}

module.exports = upgrade
