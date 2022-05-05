//During the test the env variable is set to test and allow force auth
process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../app')
let db = require('../configs/db')

//Shared data variables
let token

//API Tests
describe('API Tests', () => {
  // Before each test
  beforeEach((done) => {
    // Seed the database
    db.seed.run().then(() => {
      done()
    })
  })

  // After each test
  afterEach((done) => {
    // Logout
    chai
      .request(app)
      .get('/logout')
      .redirects(0)
      .end((err, res) => {
        res.should.have.status(302)
        done()
      })
  })

  // Admin User Tests
  describe('Admin User Tests', () => {
    // Before each admin test
    beforeEach((done) => {
      // Login as an administrator account
      chai
        .request(app)
        .get('/login?eid=test-admin')
        .end((err, res) => {
          token = res.body.token
          res.should.have.status(200)
          done()
        })
    })

    describe('GET /api/v1/', () => {
      it('should return the API version', (done) => {
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

      it('should return admin role true', (done) => {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('is_admin').eql(true)
            done()
          })
      })

      it('should return user id 1', (done) => {
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
  }) // end admin user tests

  // Student User Tests
  describe('Student User Tests', () => {
    // Before each student test
    beforeEach((done) => {
      // Login as a student account
      chai
        .request(app)
        .get('/login?eid=test-student-1')
        .end((err, res) => {
          token = res.body.token
          res.should.have.status(200)
          done()
        })
    })

    describe('GET /api/v1/', () => {
      it('should return the API version', (done) => {
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

      it('should return admin role true', (done) => {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('is_admin').eql(false)
            done()
          })
      })

      it('should return user id 2', (done) => {
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
  }) // end admin user tests
})
