//During the test the env variable is set to test and allow force auth
process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../app')
let db = require('../configs/db')

//Shared data variables
let token

//API Tests
describe('API Tests', function () {
  // Before each test
  beforeEach(function (done) {
    // Seed the database
    db.seed.run().then(function () {
      done()
    })
  })

  // // After each test
  // afterEach(function (done) {
  //   // Logout
  //   chai
  //     .request(app)
  //     .get('/logout')
  //     .redirects(0)
  //     .end((err, res) => {
  //       res.should.have.status(302)
  //       done()
  //     })
  // })

  // Admin User Tests
  describe('Admin User Tests', function () {
    // Before each admin test
    beforeEach(function (done) {
      // Login as an administrator account
      var agent = chai.request.agent(app)
      agent
        //.request(app)
        .get('/login?eid=test-admin')
        .end(() => {
          agent.get('/token').end((err, res) => {
            token = res.body.token
            res.should.have.status(200)
            agent.close()
            done()
          })
        })
    })

    describe('GET /api/v1/', function () {
      it('should return the API version', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('version').eql(1)
            done()
          })
      })

      it('should return admin role true', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('is_admin').eql(1)
            done()
          })
      })

      it('should return user id 1', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('user_id').eql(1)
            done()
          })
      })
    }) // end GET /api/v1/

    describe('GET /api/v1/queues/', function () {
      it('should return an array of size 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.should.have.a.lengthOf(3)
            done()
          })
      })

      it('should return queue 1', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
            done()
          })
      })

      it('should return queue 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
            done()
          })
      })

      it('should return queue 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
            done()
          })
      })

      it('should return all queues as helper', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('helper')
              .eql(1)
            done()
          })
      })
    }) // end GET /api/v1/queues
  }) // end admin user tests

  // Student User Tests
  describe('Student User Tests', function () {
    // Before each student test
    beforeEach(function (done) {
      // Login as a student account
      var agent = chai.request.agent(app)
      agent
        //.request(app)
        .get('/login?eid=test-student-1')
        .end(() => {
          agent.get('/token').end((err, res) => {
            token = res.body.token
            res.should.have.status(200)
            agent.close()
            done()
          })
        })
    })

    describe('GET /api/v1/', function () {
      it('should return the API version', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('version').eql(1)
            done()
          })
      })

      it('should return admin role true', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('is_admin').eql(0)
            done()
          })
      })

      it('should return user id 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('user_id').eql(2)
            done()
          })
      })
    }) // end GET /api/v1/

    describe('GET /api/v1/queues/', function () {
      it('should return an array of size 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.should.have.a.lengthOf(3)
            done()
          })
      })

      it('should return queue 1', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
            done()
          })
      })

      it('should return queue 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
            done()
          })
      })

      it('should return queue 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
            done()
          })
      })

      it('should return only queue 1 as helper', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('helper')
              .eql(0)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('helper')
              .eql(0)
            done()
          })
      })
    }) // end GET /api/v1/queues
  }) // end student user tests
})
