//https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai#a-naive-test

//During the test the env variable is set to test
process.env.NODE_ENV = 'test'
process.env.CAS_URL = ''
process.env.CAS_SERVICE_URL = ''
process.env.CAS_DEV_MODE = 'true'
process.env.CAS_DEV_USER = 'test-student-1'

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')

var app = require('../app')

chai.use(chaiHttp)
//Our parent block
describe('Base Student', () => {
  /*
   * Test the /GET route
   */
  describe('/GET api/v1/', () => {
    it('it should return the API version', (done) => {
      chai
        .request(app)
        .get('/api/v1/')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('version').eql(1)
          done()
        })
    })

    it('it should return admin role false', (done) => {
      chai
        .request(app)
        .get('/api/v1/')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('is_admin').eql(false)
          done()
        })
    })
  })
})
