//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()
const jwt = require('jsonwebtoken')

//Require app dependencies
var app = require('../../app')

exports.shouldAllowLogin = function (eid) {
  it('should allow ' + eid + ' to log in and get token', function (done) {
    var agent = chai.request.agent(app)
    agent.get('/auth/login?eid=' + eid).end(() => {
      agent.get('/auth/token').end((err, res) => {
        this.token = res.body.token
        res.should.have.status(200)
        agent
          .get('/api/v1/')
          .auth(this.token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
}

exports.tokenShouldIncludeUserData = function (user) {
  it('should include user info in token', function (done) {
    var agent = chai.request.agent(app)
    agent.get('/auth/login?eid=' + user.eid).end(() => {
      agent.get('/auth/token').end((err, res) => {
        this.token = res.body.token
        res.should.have.status(200)
        const token_user = jwt.verify(this.token, process.env.TOKEN_SECRET)
        token_user.should.have.property('user_id').eql(user.id)
        token_user.should.have.property('eid').eql(user.eid)
        token_user.should.have.property('is_admin').eql(user.is_admin)
        done()
      })
    })
  })
}

exports.shouldAllowUserToRefreshToken = function (eid) {
  it('should allow user to refresh token', function (done) {
    var agent = chai.request.agent(app)
    agent.get('/auth/login?eid=' + eid).end(() => {
      agent.get('/auth/token').end((err, res) => {
        this.token = res.body.token
        res.should.have.status(200)
        const user = jwt.verify(this.token, process.env.TOKEN_SECRET)
        const refresh_token = user.refresh_token
        agent
          .post('/auth/token')
          .send({ refresh_token: refresh_token })
          .end((err, res) => {
            this.token = res.body.token
            res.should.have.status(200)
            agent
              .get('/api/v1/')
              .auth(this.token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                done()
              })
          })
      })
    })
  })
}
