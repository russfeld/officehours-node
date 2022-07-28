//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../app')

const loginAsAdmin = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-admin').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['admin'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

const loginAsStudent1 = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-student-1').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['student1'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

const loginAsStudent2 = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-student-2').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['student2'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

const loginAsStudent3 = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-student-3').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['student3'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

const loginAsStudent4 = function (done) {
  var agent = chai.request.agent(app)
  agent.get('/auth/login?eid=test-student-4').end(() => {
    agent.get('/auth/token').end((err, res) => {
      this.token = res.body.token
      if (!this.tokens) this.tokens = {}
      this.tokens['student4'] = res.body.token
      res.should.have.status(200)
      agent.close()
      done()
    })
  })
}

module.exports = {
  loginAsAdmin: loginAsAdmin,
  loginAsStudent1: loginAsStudent1,
  loginAsStudent2: loginAsStudent2,
  loginAsStudent3: loginAsStudent3,
  loginAsStudent4: loginAsStudent4,
}
