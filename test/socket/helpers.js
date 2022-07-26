const { createServer } = require('http')
const Client = require('socket.io-client')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../app')
const { socket } = require('../../socket')

const connectAdminSocket = function (done) {
  this.admin_socket = new Client('http://localhost:3000', {
    auth: {
      token: this.admin_token,
      // HACK - make configurable
      queue_id: 1,
    },
  })
  this.admin_socket.on('connect', done)
}

const startSocketServer = function (done) {
  const server = createServer(app)
  socket.attach(server)
  server.listen(3000)
  server.on('listening', done)
}

module.exports = {
  connectAdminSocket: connectAdminSocket,
  startSocketServer: startSocketServer,
}
