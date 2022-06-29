//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldReturnAllQueues = function () {
  it('should return all queues', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        res.body.should.have.a.lengthOf(3)
        res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
        res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
        res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
        done()
      })
  })
}

exports.shouldReturnQueuesAsHelper = function (ids) {
  it('should return queues ' + ids + ' as helper', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        for (const id of ids) {
          res.body
            .find((queue) => {
              return queue.id === id
            })
            .should.have.property('helper')
            .eql(1)
        }
        done()
      })
  })
}

exports.shouldReturnQueuesAsNotHelper = function (ids) {
  it('should return queues ' + ids + ' as not helper', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        for (const id of ids) {
          res.body
            .find((queue) => {
              return queue.id === id
            })
            .should.have.property('helper')
            .eql(0)
        }
        done()
      })
  })
}

exports.shouldReturnQueuesAsEditable = function (ids) {
  it('should return queues ' + ids + ' as editable', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        for (const id of ids) {
          res.body
            .find((queue) => {
              return queue.id === id
            })
            .should.have.property('editable')
            .eql(1)
        }
        done()
      })
  })
}

exports.shouldReturnQueuesAsNotEditable = function (ids) {
  it('should return queues ' + ids + ' as not editable', function (done) {
    chai
      .request(app)
      .get('/api/v1/queues/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('array')
        for (const id of ids) {
          res.body
            .find((queue) => {
              return queue.id === id
            })
            .should.have.property('editable')
            .eql(0)
        }
        done()
      })
  })
}

exports.shouldNotAllowEdit = function (id) {
  it('should not allow editing queue ' + id, function (done) {
    chai
      .request(app)
      .post('/api/v1/queues/' + id)
      .type('json')
      .send({
        queue: {
          name: 'Updated Queue',
          snippet: 'Updated Snippet',
          description: 'Updated Description',
          users: [
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
          ],
        },
      })
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
  })
}

exports.shouldNotAllowDelete = function (id) {
  it('should not allow deleting queue ' + id, function (done) {
    chai
      .request(app)
      .delete('/api/v1/queues/' + id)
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
  })
}

exports.shouldNotAllowCreate = function () {
  it('should not allow creating queues', function (done) {
    chai
      .request(app)
      .put('/api/v1/queues/')
      .send({
        name: 'Test Queue',
      })
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(403)
        done()
      })
  })
}
