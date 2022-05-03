//https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai#a-naive-test

//During the test the env variable is set to test
process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
require('chai').should()

var app = require('../app')

let token

chai.use(chaiHttp)
//Our parent block
describe('Base Admin', () => {
  beforeEach((done) => {
    chai
      .request(app)
      .get('/login?eid=test-admin')
      .end((err, res) => {
        token = res.body.token
        res.should.have.status(200)
        done()
      })
  })

  afterEach((done) => {
    chai
      .request(app)
      .get('/logout')
      .redirects(0)
      .end((err, res) => {
        res.should.have.status(302)
        done()
      })
  })

  /*
   * Test the /GET route
   */
  describe('/GET api/v1/', () => {
    it('it should return the API version', (done) => {
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

    it('it should return admin role true', (done) => {
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

    it('it should return user id 1', (done) => {
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
  })
})
