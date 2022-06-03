//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

//Require Helpers
const { loginAsStudent1 } = require('../../helpers')

describe('test-student-1 /api/v1/users', function () {
  beforeEach(loginAsStudent1)

  describe('GET /', function () {
    it('should not allow getting all users', function (done) {
      chai
        .request(app)
        .get('/api/v1/users/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })

  describe('POST /:id', function () {
    it('should not allow updating users', function (done) {
      chai
        .request(app)
        .post('/api/v1/users/1')
        .send({
          user: {
            name: 'Updated Name',
            contact_info: 'Updated Contact Info',
            roles: [],
          },
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })

  describe('DELETE /:id', function () {
    it('should not allow deleting users', function (done) {
      chai
        .request(app)
        .delete('/api/v1/users/1')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })

  describe('PUT /', function () {
    it('should not allow creating users', function (done) {
      chai
        .request(app)
        .put('/api/v1/users/')
        .send({
          eid: 'test-student-4',
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })
})
