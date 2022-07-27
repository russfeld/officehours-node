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
  if (!this.sockets) this.sockets = {}
  this.sockets['admin'] = new Client('http://localhost:3000', {
    auth: {
      token: this.tokens['admin'],
      // HACK - make configurable
      queue_id: 3,
    },
  })
  this.sockets['admin'].on('connect', done)
}

const connectStudent1Socket = function (done) {
  if (!this.sockets) this.sockets = {}
  this.sockets['student1'] = new Client('http://localhost:3000', {
    auth: {
      token: this.tokens['student1'],
      // HACK - make configurable
      queue_id: 3,
    },
  })
  this.sockets['student1'].on('connect', done)
}

const connectStudent2Socket = function (done) {
  if (!this.sockets) this.sockets = {}
  this.sockets['student2'] = new Client('http://localhost:3000', {
    auth: {
      token: this.tokens['student2'],
      // HACK - make configurable
      queue_id: 3,
    },
  })
  this.sockets['student2'].on('connect', done)
}

const connectStudent3Socket = function (done) {
  if (!this.sockets) this.sockets = {}
  this.sockets['student3'] = new Client('http://localhost:3000', {
    auth: {
      token: this.tokens['student3'],
      // HACK - make configurable
      queue_id: 3,
    },
  })
  this.sockets['student3'].on('connect', done)
}

const startSocketServer = function (done) {
  const server = createServer(app)
  socket.attach(server)
  server.listen(3000)
  server.on('listening', done)
}

const stopSocketServer = function (done) {
  socket.close()
  done()
}

const closeAdminSocket = function (done) {
  this.sockets['admin'].close()
  done()
}

const closeStudent1Socket = function (done) {
  this.sockets['student1'].close()
  done()
}

const closeStudent2Socket = function (done) {
  this.sockets['student2'].close()
  done()
}

const closeStudent3Socket = function (done) {
  this.sockets['student3'].close()
  done()
}

module.exports = {
  connectAdminSocket: connectAdminSocket,
  connectStudent1Socket: connectStudent1Socket,
  connectStudent2Socket: connectStudent2Socket,
  connectStudent3Socket: connectStudent3Socket,
  startSocketServer: startSocketServer,
  stopSocketServer: stopSocketServer,
  closeAdminSocket: closeAdminSocket,
  closeStudent1Socket: closeStudent1Socket,
  closeStudent2Socket: closeStudent2Socket,
  closeStudent3Socket: closeStudent3Socket,
}
