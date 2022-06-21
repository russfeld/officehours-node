//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

exports.shouldReturnRequestsForQueue = function (id) {
  it('should return list of requests for queue ' + id, function (done) {
    // TODO Add Requests to see data and test here
    chai
      .request(app)
      .get('/api/v1/requests/' + id)
      .auth(this.token, { type: 'bearer' })
      .end((err, res) => {
        res.should.has.status(200)
        res.body.should.be.a('array')
        res.body.should.have.a.lengthOf(0)
        done()
      })
  })
}
