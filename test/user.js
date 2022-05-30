//During the test the env variable is set to test and allow force auth
process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()
const jwt = require('jsonwebtoken')

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

  describe('Admin User Tests', function () {
    describe('User Token Tests', function () {
      it('should allow user to log in and get token', function (done) {
        // Login as an administrator account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-admin')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              agent
                .get('/api/v1/')
                .auth(token, { type: 'bearer' })
                .end((err, res) => {
                  res.should.have.status(200)
                  done()
                })
            })
          })
      })

      it('should include user id in token', function (done) {
        // Login as an administrator account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-admin')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              user.should.have.property('user_id').eql(1)
              done()
            })
          })
      })

      it('should include eid in token', function (done) {
        // Login as an administrator account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-admin')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              user.should.have.property('eid').eql('test-admin')
              done()
            })
          })
      })

      it('should include admin status in token', function (done) {
        // Login as an administrator account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-admin')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              user.should.have.property('is_admin').eql(true)
              done()
            })
          })
      })

      it('should allow user to refresh token', function (done) {
        // Login as an administrator account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-admin')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              const refresh_token = user.refresh_token
              agent
                .post('/token')
                .send({ refresh_token: refresh_token })
                .end((err, res) => {
                  token = res.body.token
                  res.should.have.status(200)
                  agent
                    .get('/api/v1/')
                    .auth(token, { type: 'bearer' })
                    .end((err, res) => {
                      res.should.have.status(200)
                      done()
                    })
                })
            })
          })
      })
    })
  })

  describe('Student User Tests', function () {
    describe('User Token Tests', function () {
      it('should allow user to log in and get token', function (done) {
        // Login as an student account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-student-1')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              agent
                .get('/api/v1/')
                .auth(token, { type: 'bearer' })
                .end((err, res) => {
                  res.should.have.status(200)
                  done()
                })
            })
          })
      })

      it('should include user id in token', function (done) {
        // Login as an student account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-student-1')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              user.should.have.property('user_id').eql(2)
              done()
            })
          })
      })

      it('should include eid in token', function (done) {
        // Login as an student account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-student-1')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              user.should.have.property('eid').eql('test-student-1')
              done()
            })
          })
      })

      it('should include admin status in token', function (done) {
        // Login as an student account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-student-1')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              user.should.have.property('is_admin').eql(false)
              done()
            })
          })
      })

      it('should allow user to refresh token', function (done) {
        // Login as an administrator account
        var agent = chai.request.agent(app)
        agent
          //.request(app)
          .get('/login?eid=test-admin')
          .end(() => {
            agent.get('/token').end((err, res) => {
              token = res.body.token
              res.should.have.status(200)
              const user = jwt.verify(token, process.env.TOKEN_SECRET)
              const refresh_token = user.refresh_token
              agent
                .post('/token')
                .send({ refresh_token: refresh_token })
                .end((err, res) => {
                  token = res.body.token
                  res.should.have.status(200)
                  agent
                    .get('/api/v1/')
                    .auth(token, { type: 'bearer' })
                    .end((err, res) => {
                      res.should.have.status(200)
                      done()
                    })
                })
            })
          })
      })
    })
  })
})
