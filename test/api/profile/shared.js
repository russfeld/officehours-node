//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldReturnProfile = function (user) {
  it('should return correct user profile', function (done) {
    chai
      .request(app)
      .get('/api/v1/profile/')
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.has.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('id').eql(user.id)
        res.body.should.have.property('eid').eql(user.eid)
        res.body.should.have.property('name').eql(user.name)
        done()
      })
  })
}

exports.shouldUpdateProfile = function (user, newUser) {
  it('should update user data', function (done) {
    chai
      .request(app)
      .post('/api/v1/profile/')
      .type('json')
      .send({
        user: {
          eid: newUser.eid, // cannot change
          name: newUser.name,
          contact_info: newUser.contact_info,
        },
      })
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.have.status(200)
        chai
          .request(app)
          .get('/api/v1/profile/')
          .auth(this.token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('id').eql(user.id)
            res.body.should.have.property('eid').eql(user.eid)
            res.body.should.have.property('name').eql(newUser.name)
            res.body.should.have
              .property('contact_info')
              .eql(newUser.contact_info)
            done()
          })
      })
  })
}
