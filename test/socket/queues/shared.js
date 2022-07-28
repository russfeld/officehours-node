//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldConnectToQueueSocket = function (user) {
  it('should connect to queue socket', function (done) {
    this.sockets[user].emit('queue:connect', (response, requests) => {
      response.should.equal(200)
      requests.should.be.a('array')
      requests.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
      requests.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
      requests.map(({ id }) => ({ id })).should.not.deep.include({ id: 1 })
      done()
    })
  })
}

exports.shouldOpenQueue = function (user) {
  it('should open the queue', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.tokens[user], { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body
          .find((queue) => {
            return queue.id === 3
          })
          .should.have.property('is_open')
          .eql(0)
        this.sockets[user].emit('queue:open', (response) => {
          response.should.equal(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.tokens[user], { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body
                .find((queue) => {
                  return queue.id === 3
                })
                .should.have.property('is_open')
                .eql(1)
            })
          done()
        })
      })
  })
}

exports.shouldEmitQueueOpeningAfterOpening = function (admin, user) {
  it('should emit queue:opening after opening queue', function (done) {
    this.sockets[user].on('queue:opening', () => {
      done()
    })
    this.sockets[admin].emit('queue:open', (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldCloseQueue = function (user) {
  it('should close the queue', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.tokens[user], { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body
          .find((queue) => {
            return queue.id === 3
          })
          .should.have.property('is_open')
          .eql(0)
        this.sockets[user].emit('queue:open', (response) => {
          response.should.equal(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.tokens[user], { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body
                .find((queue) => {
                  return queue.id === 3
                })
                .should.have.property('is_open')
                .eql(1)
            })
          this.sockets[user].emit('queue:close', (response) => {
            response.should.equal(200)
            chai
              .request(app)
              .get('/api/v1/queues/')
              .auth(this.tokens[user], { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body
                  .find((queue) => {
                    return queue.id === 3
                  })
                  .should.have.property('is_open')
                  .eql(0)
              })
            done()
          })
        })
      })
  })
}

exports.shouldEmitQueueClosingAfterClosing = function (admin, user) {
  it('should emit queue:closing after closing queue', function (done) {
    this.sockets[user].on('queue:closing', () => {
      done()
    })
    this.sockets[admin].emit('queue:close', (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldJoinOpenQueue = function (admin, user) {
  it('should join open queue', function (done) {
    this.sockets[admin].emit('queue:open', (response) => {
      response.should.equal(200)
      this.sockets[user].emit('queue:join', (response) => {
        response.should.equal(200)
        done()
      })
    })
  })
}

exports.shouldEmitQueueUpdateAfterJoin = function (admin, user) {
  it('should emit queue update after join', function (done) {
    this.sockets[admin].emit('queue:open', (response) => {
      response.should.equal(200)
      this.sockets[admin].on('queue:update', (request) => {
        request.should.have.property('user_id').eql(5)
        request.should.have.property('queue_id').eql(3)
        request.should.have.property('status_id').eql(1)
        done()
      })
      this.sockets[user].emit('queue:join', (response) => {
        response.should.equal(200)
      })
    })
  })
}

exports.shouldNotJoinClosedQueue = function (user) {
  it('should not join closed queue', function (done) {
    this.sockets[user].emit('queue:join', (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotOpenQueue = function (user) {
  it('should not open the queue', function (done) {
    this.sockets[user].emit('queue:open', (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotCloseQueue = function (user) {
  it('should not close the queue', function (done) {
    this.sockets[user].emit('queue:close', (response) => {
      response.should.equal(403)
      done()
    })
  })
}
