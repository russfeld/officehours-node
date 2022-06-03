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
    it('should not get roles', function (done) {
      chai
        .request(app)
        .get('/api/v1/roles/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(403)
          done()
        })
    })
  })
})
