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
            return queue.id === this.queue_id
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
                  return queue.id === this.queue_id
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
            return queue.id === this.queue_id
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
              return queue.id === this.queue_id
            })
            .should.have.property('is_open')
            .eql(0)
        })
      done()
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

exports.shouldJoinOpenQueue = function (user) {
  it('should join open queue', function (done) {
    this.sockets[user].emit('queue:join', (response) => {
      response.should.equal(200)
      done()
    })
  })
}

exports.shouldEmitQueueUpdateAfterJoin = function (admin, user) {
  it('should emit queue update after join', function (done) {
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
}

exports.shouldStoreRequestAfterJoin = function (admin, user) {
  it('should store request after join', function (done) {
    this.sockets[admin].emit('queue:open', (response) => {
      response.should.equal(200)
      this.sockets[admin].on('queue:update', (request) => {
        request.should.have.property('user_id').eql(5)
        request.should.have.property('queue_id').eql(3)
        request.should.have.property('status_id').eql(1)
        request.should.have.property('id')
        const req_id = request.id
        this.sockets[admin].emit('queue:connect', (response, requests) => {
          response.should.equal(200)
          requests.should.be.a('array')
          requests.map(({ id }) => ({ id })).should.deep.include({ id: req_id })
          done()
        })
      })
      this.sockets[user].emit('queue:join', (response) => {
        response.should.equal(200)
      })
    })
  })
}

exports.shouldEmitSameRequestAfterMultipleJoin = function (admin, user) {
  it('should emit same request after multiple join', function (done) {
    this.sockets[admin].emit('queue:open', (response) => {
      response.should.equal(200)
      var req_id = null
      this.sockets[admin].on('queue:update', (request) => {
        request.should.have.property('user_id').eql(5)
        request.should.have.property('queue_id').eql(3)
        request.should.have.property('status_id').eql(1)
        request.should.have.property('id')
        if (!req_id) {
          req_id = request.id
        } else {
          request.should.have.property('id').eql(req_id)
          done()
        }
      })
      this.sockets[user].emit('queue:join', (response) => {
        response.should.equal(200)
        this.sockets[user].emit('queue:join', (response) => {
          response.should.equal(200)
        })
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

exports.shouldNotJoinQueueAsHelper = function (user) {
  it('should not join queue as helper', function (done) {
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

exports.shouldTakeRequest = function (user) {
  it('should take request', function (done) {
    this.sockets[user].emit('request:take', 3, (response) => {
      response.should.equal(200)
      done()
    })
  })
}

exports.shouldNotTakeRequest = function (user) {
  it('should not take request', function (done) {
    this.sockets[user].emit('request:take', 3, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotTakeRequestClosedQueue = function (user) {
  it('should not take request in closed queue', function (done) {
    this.sockets[user].emit('request:take', 3, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotTakeBadRequest = function (user) {
  it('should not take bad request', function (done) {
    this.sockets[user].emit('request:take', 0, (response) => {
      response.should.equal(500)
      done()
    })
  })
}

exports.shouldEmitQueueUpdateAfterTake = function (admin, user) {
  it('should emit queue update after take', function (done) {
    this.sockets[user].on('queue:update', (request) => {
      request.should.have.property('user_id').eql(2)
      request.should.have.property('queue_id').eql(3)
      request.should.have.property('status_id').eql(2)
      request.should.have.property('id').eql(3)
      done()
    })
    this.sockets[admin].emit('request:take', 3, (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldStoreRequestAfterTake = function (admin) {
  it('should store request after take', function (done) {
    this.sockets[admin].emit('request:take', 3, (response) => {
      response.should.equal(200)
      this.sockets[admin].emit('queue:connect', (response, requests) => {
        response.should.equal(200)
        requests.should.be.a('array')
        requests.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
        const request = requests.find((request) => {
          return request.id === 3
        })
        request.should.have.property('status_id').eql(2)
        done()
      })
    })
  })
}

exports.shouldDeleteRequest = function (user) {
  it('should delete request', function (done) {
    this.sockets[user].emit('request:delete', 2, (response) => {
      response.should.equal(200)
      done()
    })
  })
}

exports.shouldNotDeleteRequest = function (user) {
  it('should not delete request', function (done) {
    this.sockets[user].emit('request:delete', 2, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotDeleteRequestClosedQueue = function (user) {
  it('should not delete request in closed queue', function (done) {
    this.sockets[user].emit('request:delete', 2, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotDeleteBadRequest = function (user) {
  it('should not delete bad request', function (done) {
    this.sockets[user].emit('request:delete', 0, (response) => {
      response.should.equal(500)
      done()
    })
  })
}

exports.shouldEmitQueueRemoveAfterDelete = function (admin, user) {
  it('should emit queue remove after delete', function (done) {
    this.sockets[user].on('queue:remove', (request) => {
      request.should.eql(2)
      done()
    })
    this.sockets[admin].emit('request:delete', 2, (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldRemoveRequestAfterDelete = function (admin) {
  it('should remove request after delete', function (done) {
    this.sockets[admin].emit('request:delete', 2, (response) => {
      response.should.equal(200)
      this.sockets[admin].emit('queue:connect', (response, requests) => {
        response.should.equal(200)
        requests.should.be.a('array')
        requests.map(({ id }) => ({ id })).should.not.deep.include({ id: 2 })
        done()
      })
    })
  })
}

exports.shouldFinishRequest = function (user) {
  it('should finish request', function (done) {
    this.sockets[user].emit('request:finish', 2, (response) => {
      response.should.equal(200)
      done()
    })
  })
}

exports.shouldNotFinishRequest = function (user) {
  it('should not finish request', function (done) {
    this.sockets[user].emit('request:finish', 2, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotFinishRequestClosedQueue = function (user) {
  it('should not finish request in closed queue', function (done) {
    this.sockets[user].emit('request:finish', 2, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotFinishBadRequest = function (user) {
  it('should not finish bad request', function (done) {
    this.sockets[user].emit('request:finish', 0, (response) => {
      response.should.equal(500)
      done()
    })
  })
}

exports.shouldEmitQueueRemoveAfterFinish = function (admin, user) {
  it('should emit queue remove after finish', function (done) {
    this.sockets[user].on('queue:remove', (request) => {
      request.should.eql(2)
      done()
    })
    this.sockets[admin].emit('request:finish', 2, (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldRemoveRequestAfterFinish = function (admin) {
  it('should remove request after finish', function (done) {
    this.sockets[admin].emit('request:finish', 2, (response) => {
      response.should.equal(200)
      this.sockets[admin].emit('queue:connect', (response, requests) => {
        response.should.equal(200)
        requests.should.be.a('array')
        requests.map(({ id }) => ({ id })).should.not.deep.include({ id: 2 })
        done()
      })
    })
  })
}

exports.shouldRequeueRequest = function (user) {
  it('should requeue request', function (done) {
    this.sockets[user].emit('request:requeue', 2, (response) => {
      response.should.equal(200)
      done()
    })
  })
}

exports.shouldNotRequeueRequest = function (user) {
  it('should not requeue request', function (done) {
    this.sockets[user].emit('request:requeue', 2, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotRequeueRequestClosedQueue = function (user) {
  it('should not requeue request in closed queue', function (done) {
    this.sockets[user].emit('request:requeue', 2, (response) => {
      response.should.equal(403)
      done()
    })
  })
}

exports.shouldNotRequeueBadRequest = function (user) {
  it('should not requeue bad request', function (done) {
    this.sockets[user].emit('request:requeue', 0, (response) => {
      response.should.equal(500)
      done()
    })
  })
}

exports.shouldEmitQueueRemoveAfterRequeue = function (admin, user) {
  it('should emit queue remove after requeue', function (done) {
    this.sockets[user].on('queue:remove', (request) => {
      request.should.eql(2)
      done()
    })
    this.sockets[admin].emit('request:requeue', 2, (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldRemoveRequestAfterRequeue = function (admin) {
  it('should remove request after requeue', function (done) {
    this.sockets[admin].emit('request:requeue', 2, (response) => {
      response.should.equal(200)
      this.sockets[admin].emit('queue:connect', (response, requests) => {
        response.should.equal(200)
        requests.should.be.a('array')
        requests.map(({ id }) => ({ id })).should.not.deep.include({ id: 2 })
        done()
      })
    })
  })
}

exports.shouldEmitQueueUpdateAfterRequeue = function (admin, user) {
  it('should emit queue update after requeue', function (done) {
    this.sockets[user].on('queue:update', (request) => {
      request.should.have.property('user_id').eql(3)
      request.should.have.property('queue_id').eql(3)
      request.should.have.property('status_id').eql(1)
      done()
    })
    this.sockets[admin].emit('request:requeue', 2, (response) => {
      response.should.equal(200)
    })
  })
}

exports.shouldStoreRequestAfterRequeue = function (admin) {
  it('should store request after requeue', function (done) {
    this.sockets[admin].emit('request:requeue', 2, (response) => {
      response.should.equal(200)
      this.sockets[admin].emit('queue:connect', (response, requests) => {
        response.should.equal(200)
        requests.should.be.a('array')
        const request = requests.find((request) => {
          return request.user_id === 3
        })
        request.should.have.property('status_id').eql(1)
        done()
      })
    })
  })
}
