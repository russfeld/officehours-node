//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

describe('test-admin /api/v1/roles', function () {
  beforeEach(loginAsAdmin)

  describe('GET //', function () {
    it('should get all roles', function (done) {
      chai
        .request(app)
        .get('/api/v1/roles/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.should.have.a.lengthOf(1)
          const role = res.body.find((role) => {
            return role.id === 1
          })
          role.should.have.property('name').eql('admin')
          done()
        })
    })
  })
})
