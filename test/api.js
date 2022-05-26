//During the test the env variable is set to test and allow force auth
process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../app')
let db = require('../configs/db')

//Shared data variables
let token

//API Tests
describe('API Tests', function () {
  // Before each test
  beforeEach(function (done) {
    // Seed the database
    db.seed.run().then(function () {
      done()
    })
  })

  // // After each test
  // afterEach(function (done) {
  //   // Logout
  //   chai
  //     .request(app)
  //     .get('/logout')
  //     .redirects(0)
  //     .end((err, res) => {
  //       res.should.have.status(302)
  //       done()
  //     })
  // })

  // Admin User Tests
  describe('Admin User Tests', function () {
    // Before each admin test
    beforeEach(function (done) {
      // Login as an administrator account
      var agent = chai.request.agent(app)
      agent
        //.request(app)
        .get('/login?eid=test-admin')
        .end(() => {
          agent.get('/token').end((err, res) => {
            token = res.body.token
            res.should.have.status(200)
            agent.close()
            done()
          })
        })
    })

    describe('GET /api/v1/', function () {
      it('should return the API version', function (done) {
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

      it('should return admin role true', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('is_admin').eql(1)
            done()
          })
      })

      it('should return user id 1', function (done) {
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
    }) // end GET /api/v1/

    describe('GET /api/v1/queues/', function () {
      it('should return an array of size 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.should.have.a.lengthOf(3)
            done()
          })
      })

      it('should return queue 1', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
            done()
          })
      })

      it('should return queue 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
            done()
          })
      })

      it('should return queue 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
            done()
          })
      })

      it('should return all queues as helper', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('helper')
              .eql(1)
            done()
          })
      })

      it('should return all queues as editable', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('editable')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('editable')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('editable')
              .eql(1)
            done()
          })
      })
    }) // end GET /api/v1/queues

    describe('POST /api/v1/queues/1/edit', function () {
      it('should edit queue data', function (done) {
        chai
          .request(app)
          .post('/api/v1/queues/1/edit')
          .type('json')
          .send({
            queue: {
              name: 'Updated Queue',
              snippet: 'Updated Snippet',
              description: 'Updated Description',
              users: [
                {
                  id: 1,
                },
                {
                  id: 2,
                },
                {
                  id: 3,
                },
              ],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/queues/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                const queue = res.body.find((queue) => {
                  return queue.id === 1
                })
                queue.should.have.property('name').eql('Updated Queue')
                queue.should.have.property('snippet').eql('Updated Snippet')
                queue.should.have
                  .property('description')
                  .eql('Updated Description')
                done()
              })
          })
      })
      it('should remove a helper', function (done) {
        chai
          .request(app)
          .post('/api/v1/queues/1/edit')
          .type('json')
          .send({
            queue: {
              name: 'Updated Queue',
              snippet: 'Updated Snippet',
              description: 'Updated Description',
              users: [
                {
                  id: 2,
                },
                {
                  id: 3,
                },
              ],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/queues/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                const queue = res.body.find((queue) => {
                  return queue.id === 1
                })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.not.deep.include({ id: 1 })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 2 })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 3 })
                done()
              })
          })
      })
      it('should add a helper', function (done) {
        chai
          .request(app)
          .post('/api/v1/queues/3/edit')
          .type('json')
          .send({
            queue: {
              name: 'Updated Queue',
              snippet: 'Updated Snippet',
              description: 'Updated Description',
              users: [
                {
                  id: 2,
                },
                {
                  id: 3,
                },
              ],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/queues/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                const queue = res.body.find((queue) => {
                  return queue.id === 3
                })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.not.deep.include({ id: 1 })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 2 })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 3 })
                done()
              })
          })
      })
      it('should change helpers', function (done) {
        chai
          .request(app)
          .post('/api/v1/queues/3/edit')
          .type('json')
          .send({
            queue: {
              name: 'Updated Queue',
              snippet: 'Updated Snippet',
              description: 'Updated Description',
              users: [
                {
                  id: 2,
                },
              ],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/queues/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                const queue = res.body.find((queue) => {
                  return queue.id === 3
                })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.not.deep.include({ id: 1 })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 2 })
                queue.users
                  .map(({ id }) => ({ id }))
                  .should.not.deep.include({ id: 3 })
                done()
              })
          })
      })
      it('should reject invalid data', function (done) {
        chai
          .request(app)
          .post('/api/v1/queues/1/edit')
          .type('json')
          .send({
            queue: {
              name: '',
              snippet: '',
              description: '',
              users: [],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(422)
            res.body.should.be.a('object')
            res.body.should.have.property('name').eql('ValidationError')
            res.body.data.should.have.property('name')
            done()
          })
      })
    })

    describe('GET /api/v1/users', function () {
      it('should return an array of size 4', function (done) {
        chai
          .request(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.should.have.a.lengthOf(4)
            done()
          })
      })

      it('should return user 1', function (done) {
        chai
          .request(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
            done()
          })
      })

      it('should return user 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
            done()
          })
      })

      it('should return user 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
            done()
          })
      })

      it('should return user 4', function (done) {
        chai
          .request(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 4 })
            done()
          })
      })
    })
  }) // end admin user tests

  // Student User Tests
  describe('Student User 1 Tests', function () {
    // Before each student test
    beforeEach(function (done) {
      // Login as a student account
      var agent = chai.request.agent(app)
      agent
        //.request(app)
        .get('/login?eid=test-student-1')
        .end(() => {
          agent.get('/token').end((err, res) => {
            token = res.body.token
            res.should.have.status(200)
            agent.close()
            done()
          })
        })
    })

    describe('GET /api/v1/', function () {
      it('should return the API version', function (done) {
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

      it('should return admin role false', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('is_admin').eql(0)
            done()
          })
      })

      it('should return user id 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('user_id').eql(2)
            done()
          })
      })
    }) // end GET /api/v1/

    describe('GET /api/v1/queues/', function () {
      it('should return an array of size 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.should.have.a.lengthOf(3)
            done()
          })
      })

      it('should return queue 1', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
            done()
          })
      })

      it('should return queue 2', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
            done()
          })
      })

      it('should return queue 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
            done()
          })
      })

      it('should return queue 1 as helper', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('helper')
              .eql(0)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('helper')
              .eql(0)
            done()
          })
      })

      it('should return no queues as editable', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('editable')
              .eql(0)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('editable')
              .eql(0)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('editable')
              .eql(0)
            done()
          })
      })
    }) // end GET /api/v1/queues

    describe('POST /api/v1/queues/1/edit', function () {
      it('should not allow editing', function (done) {
        chai
          .request(app)
          .post('/api/v1/queues/1/edit')
          .type('json')
          .send({
            queue: {
              name: 'Updated Queue',
              snippet: 'Updated Snippet',
              description: 'Updated Description',
              users: [
                {
                  id: 1,
                },
                {
                  id: 2,
                },
                {
                  id: 3,
                },
              ],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(403)
            done()
          })
      })
    })

    describe('GET /api/v1/users', function () {
      it('should not allow access', function (done) {
        chai
          .request(app)
          .get('/api/v1/users/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(403)
            done()
          })
      })
    })
  }) // end student 1 user tests

  // Student User Tests
  describe('Student User 2 Tests', function () {
    // Before each student test
    beforeEach(function (done) {
      // Login as a student account
      var agent = chai.request.agent(app)
      agent
        //.request(app)
        .get('/login?eid=test-student-2')
        .end(() => {
          agent.get('/token').end((err, res) => {
            token = res.body.token
            res.should.have.status(200)
            agent.close()
            done()
          })
        })
    })

    describe('GET /api/v1/', function () {
      it('should return user id 3', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('user_id').eql(3)
            done()
          })
      })
    }) // end GET /api/v1

    describe('GET /api/v1/queues/', function () {
      it('should return queue 1 and 2 as helper', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('helper')
              .eql(0)
            done()
          })
      })
    }) // end GET /api/v1/queues
  }) // end student 2 tests

  // Student User Tests
  describe('Student User 3 Tests', function () {
    // Before each student test
    beforeEach(function (done) {
      // Login as a student account
      var agent = chai.request.agent(app)
      agent
        //.request(app)
        .get('/login?eid=test-student-3')
        .end(() => {
          agent.get('/token').end((err, res) => {
            token = res.body.token
            res.should.have.status(200)
            agent.close()
            done()
          })
        })
    })

    describe('GET /api/v1/', function () {
      it('should return user id 4', function (done) {
        chai
          .request(app)
          .get('/api/v1/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('user_id').eql(4)
            done()
          })
      })
    }) // end GET /api/v1

    describe('GET /api/v1/queues/', function () {
      it('should return queue 1, 2, and 3 as helper', function (done) {
        chai
          .request(app)
          .get('/api/v1/queues/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            res.body
              .find((queue) => {
                return queue.id === 1
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 2
              })
              .should.have.property('helper')
              .eql(1)
            res.body
              .find((queue) => {
                return queue.id === 3
              })
              .should.have.property('helper')
              .eql(1)
            done()
          })
      })
    }) // end GET /api/v1/queues
  }) // end student 2 tests
})
