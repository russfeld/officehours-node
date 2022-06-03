//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

//Require Shared Tests
const shared = require('./shared')

describe('test-admin /api/v1/queues', function () {
  beforeEach(loginAsAdmin)

  describe('GET /', function () {
    shared.shouldReturnAllQueues()
    shared.shouldReturnQueuesAsHelper([1, 2, 3])
    shared.shouldReturnQueuesAsEditable([1, 2, 3])
  })

  describe('POST /:id', function () {
    it('should edit queue data', function (done) {
      chai
        .request(app)
        .post('/api/v1/queues/1')
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
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              const queue = res.body.find((queue) => {
                return queue.id === 1
              })
              queue.should.have.property('name').eql('Updated Queue')
              queue.should.have.property('snippet').eql('Updated Snippet')
              queue.should.have
                .property('description')
                .eql('Updated Description')
              done()
            })
        })
    })
    it('should remove a helper', function (done) {
      chai
        .request(app)
        .post('/api/v1/queues/1')
        .type('json')
        .send({
          queue: {
            name: 'Updated Queue',
            snippet: 'Updated Snippet',
            description: 'Updated Description',
            users: [
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
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              const queue = res.body.find((queue) => {
                return queue.id === 1
              })
              queue.users
                .map(({ id }) => ({ id }))
                .should.not.deep.include({ id: 1 })
              queue.users
                .map(({ id }) => ({ id }))
                .should.deep.include({ id: 2 })
              queue.users
                .map(({ id }) => ({ id }))
                .should.deep.include({ id: 3 })
              done()
            })
        })
    })
    it('should add a helper', function (done) {
      chai
        .request(app)
        .post('/api/v1/queues/3')
        .type('json')
        .send({
          queue: {
            name: 'Updated Queue',
            snippet: 'Updated Snippet',
            description: 'Updated Description',
            users: [
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
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              const queue = res.body.find((queue) => {
                return queue.id === 3
              })
              queue.users
                .map(({ id }) => ({ id }))
                .should.not.deep.include({ id: 1 })
              queue.users
                .map(({ id }) => ({ id }))
                .should.deep.include({ id: 2 })
              queue.users
                .map(({ id }) => ({ id }))
                .should.deep.include({ id: 3 })
              done()
            })
        })
    })
    it('should change helpers', function (done) {
      chai
        .request(app)
        .post('/api/v1/queues/3')
        .type('json')
        .send({
          queue: {
            name: 'Updated Queue',
            snippet: 'Updated Snippet',
            description: 'Updated Description',
            users: [
              {
                id: 2,
              },
            ],
          },
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              const queue = res.body.find((queue) => {
                return queue.id === 3
              })
              queue.users
                .map(({ id }) => ({ id }))
                .should.not.deep.include({ id: 1 })
              queue.users
                .map(({ id }) => ({ id }))
                .should.deep.include({ id: 2 })
              queue.users
                .map(({ id }) => ({ id }))
                .should.not.deep.include({ id: 3 })
              done()
            })
        })
    })
    it('should reject invalid data', function (done) {
      chai
        .request(app)
        .post('/api/v1/queues/1')
        .type('json')
        .send({
          queue: {
            name: '',
            snippet: '',
            description: '',
            users: [],
          },
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('name').eql('ValidationError')
          res.body.data.should.have.property('name')
          done()
        })
    })
    it('should reject bad queue id', function (done) {
      chai
        .request(app)
        .post('/api/v1/queues/4')
        .type('json')
        .send({
          queue: {
            name: 'Updated Queue',
            snippet: 'Updated Snippet',
            description: 'Updated Description',
            users: [
              {
                id: 2,
              },
            ],
          },
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('name').eql('NotFoundError')
          done()
        })
    })
  })

  describe('POST /:id/toggle', function () {
    shared.shouldToggleQueue(1)
    shared.shouldToggleQueue(2)
    shared.shouldToggleQueue(3)
  })

  describe('DELETE /:id', function () {
    it('should delete queue', function (done) {
      chai
        .request(app)
        .delete('/api/v1/queues/3')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
              res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
              res.body
                .map(({ id }) => ({ id }))
                .should.not.deep.include({ id: 3 })
              done()
            })
        })
    })
    it('should reject bad queue id', function (done) {
      chai
        .request(app)
        .delete('/api/v1/queues/4')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
    })
  })

  describe('PUT /', function () {
    it('should create new queues', function (done) {
      chai
        .request(app)
        .put('/api/v1/queues/')
        .type('json')
        .send({
          name: 'Test Queue',
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          const new_id = res.body.id
          chai
            .request(app)
            .get('/api/v1/queues/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body
                .map(({ id }) => ({ id }))
                .should.deep.include({ id: new_id })
              const queue = res.body.find((queue) => {
                return queue.id === new_id
              })
              queue.should.have.property('name').eql('Test Queue')
              done()
            })
        })
    })
    it('should require a name', function (done) {
      chai
        .request(app)
        .put('/api/v1/queues/')
        .type('json')
        .send({
          name: '',
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('name').eql('ValidationError')
          res.body.data.should.have.property('name')
          done()
        })
    })
  })
})
