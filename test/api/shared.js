//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../app')

exports.shouldReturnApiVersion = function () {
  it('should return the API version', function (done) {
    chai
      .request(app)
      .get('/api/v1/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('version').eql(1)
        done()
      })
  })
}

exports.shouldReturnAdminRole = function (role) {
  it('should return admin role ' + role, function (done) {
    chai
      .request(app)
      .get('/api/v1/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('is_admin').eql(role)
        done()
      })
  })
}

exports.shouldReturnUserId = function (id) {
  it('should return user id ' + id, function (done) {
    chai
      .request(app)
      .get('/api/v1/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('user_id').eql(id)
        done()
      })
  })
}
