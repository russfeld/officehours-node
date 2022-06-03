//During the test the env variable is set to test and allow force auth
process.env.NODE_ENV = 'test'
process.env.FORCE_AUTH = 'true'

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
// const { redirect } = require('express/lib/response')
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
  // beforeEach(function (done) {
  //   // Seed the database
  //   db.seed.run().then(function () {
  //     done()
  //   })
  // })

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
    beforeEach('Login as Admin', function (done) {
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
            const user = res.body.find((user) => {
              return user.id === 1
            })
            user.roles.should.be.a('array')
            user.roles.should.have.a.lengthOf(1)
            user.roles[0].name.should.eql('admin')
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

    describe('POST /api/v1/users', function () {
      it('should update user data', function (done) {
        chai
          .request(app)
          .post('/api/v1/users/2')
          .type('json')
          .send({
            user: {
              name: 'Updated Name',
              contact_info: 'Updated Contact Info',
              roles: [],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/users/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                const user = res.body.find((user) => {
                  return user.id === 2
                })
                user.should.have.property('name').eql('Updated Name')
                user.should.have
                  .property('contact_info')
                  .eql('Updated Contact Info')
                done()
              })
          })
      })
      it('should reject bad user data', function (done) {
        chai
          .request(app)
          .post('/api/v1/users/2')
          .type('json')
          .send({
            user: {
              name: '',
              contact_info: '',
              roles: [],
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

      it('should reject bad user id', function (done) {
        chai
          .request(app)
          .post('/api/v1/users/5')
          .type('json')
          .send({
            user: {
              name: 'Updated Name',
              contact_info: 'Updated Contact Info',
              roles: [],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.body.should.be.a('object')
            res.body.should.have.property('name').eql('NotFoundError')
            done()
          })
      })
      it('should update user roles', function (done) {
        chai
          .request(app)
          .post('/api/v1/users/2')
          .type('json')
          .send({
            user: {
              name: 'Updated Name',
              contact_info: 'Updated Contact Info',
              roles: [
                {
                  id: 1,
                },
              ],
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/users/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                const user = res.body.find((user) => {
                  return user.id === 2
                })
                user.roles
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 1 })
                chai
                  .request(app)
                  .post('/api/v1/users/2')
                  .type('json')
                  .send({
                    user: {
                      name: 'Updated Name',
                      contact_info: 'Updated Contact Info',
                      roles: [],
                    },
                  })
                  .auth(token, { type: 'bearer' })
                  .end((err, res) => {
                    res.should.have.status(204)
                    chai
                      .request(app)
                      .get('/api/v1/users/')
                      .auth(token, { type: 'bearer' })
                      .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('array')
                        const user = res.body.find((user) => {
                          return user.id === 2
                        })
                        user.roles
                          .map(({ id }) => ({ id }))
                          .should.not.deep.include({ id: 1 })
                        done()
                      })
                  })
              })
          })
      })
    })

    describe('DELETE /api/v1/users', function () {
      it('should delete user', function (done) {
        chai
          .request(app)
          .delete('/api/v1/users/4')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/users/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 1 })
                res.body
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 2 })
                res.body
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: 3 })
                res.body
                  .map(({ id }) => ({ id }))
                  .should.not.deep.include({ id: 4 })
                done()
              })
          })
      })
      it('should reject bad user id', function (done) {
        chai
          .request(app)
          .delete('/api/v1/users/5')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(422)
            done()
          })
      })
      it('should not allow delete self', function (done) {
        chai
          .request(app)
          .delete('/api/v1/users/1')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(422)
            done()
          })
      })
    })

    describe('PUT /api/v1/users', function () {
      it('should create new user', function (done) {
        chai
          .request(app)
          .put('/api/v1/users/')
          .type('json')
          .send({
            eid: 'test-student-4',
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(201)
            res.body.should.be.a('object')
            res.body.should.have.property('id')
            const new_id = res.body.id
            chai
              .request(app)
              .get('/api/v1/users/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body
                  .map(({ id }) => ({ id }))
                  .should.deep.include({ id: new_id })
                const user = res.body.find((user) => {
                  return user.id === new_id
                })
                user.should.have.property('eid').eql('test-student-4')
                done()
              })
          })
      })
      it('should require an eID with 3 characters', function (done) {
        chai
          .request(app)
          .put('/api/v1/users/')
          .type('json')
          .send({
            eid: 'ab',
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(422)
            res.body.should.be.a('object')
            res.body.should.have.property('name').eql('ValidationError')
            res.body.data.should.have.property('eid')
            done()
          })
      })
    })

    describe('GET /api/v1/user', function () {
      it('should return user data', function (done) {
        chai
          .request(app)
          .get('/api/v1/user/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('id').eql(1)
            res.body.should.have.property('eid').eql('test-admin')
            res.body.should.have.property('name').eql('Test Administrator')
            done()
          })
      })
    })
    describe('POST /api/v1/user', function () {
      it('should update user data', function (done) {
        chai
          .request(app)
          .post('/api/v1/user/')
          .type('json')
          .send({
            user: {
              eid: 'changed-eid', // cannot change
              name: 'New Name',
              contact_info: 'New Contact Info',
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/user/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.has.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('id').eql(1)
                res.body.should.have.property('eid').eql('test-admin')
                res.body.should.have.property('name').eql('New Name')
                res.body.should.have
                  .property('contact_info')
                  .eql('New Contact Info')
                done()
              })
          })
      })
    })

    describe('GET /api/v1/roles', function () {
      it('should get roles', function (done) {
        chai
          .request(app)
          .get('/api/v1/roles/')
          .auth(token, { type: 'bearer' })
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

    describe('POST /api/v1/users', function () {
      it('should not allow updates', function (done) {
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
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(403)
            done()
          })
      })
    })

    describe('DELETE /api/v1/users', function () {
      it('should not allow deletes', function (done) {
        chai
          .request(app)
          .delete('/api/v1/users/1')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(403)
            done()
          })
      })
    })

    describe('PUT /api/v1/users', function () {
      it('should not allow access', function (done) {
        chai
          .request(app)
          .put('/api/v1/users/')
          .send({
            eid: 'test-student-4',
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(403)
            done()
          })
      })
    })

    describe('GET /api/v1/user', function () {
      it('should return user data', function (done) {
        chai
          .request(app)
          .get('/api/v1/user/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('id').eql(2)
            res.body.should.have.property('eid').eql('test-student-1')
            res.body.should.have.property('name').eql('Test Student 1')
            done()
          })
      })
    })
    describe('POST /api/v1/user', function () {
      it('should update user data', function (done) {
        chai
          .request(app)
          .post('/api/v1/user/')
          .type('json')
          .send({
            user: {
              eid: 'changed-eid', // cannot change
              name: 'New Name',
              contact_info: 'New Contact Info',
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/user/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.has.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('id').eql(2)
                res.body.should.have.property('eid').eql('test-student-1')
                res.body.should.have.property('name').eql('New Name')
                res.body.should.have
                  .property('contact_info')
                  .eql('New Contact Info')
                done()
              })
          })
      })
    })

    describe('GET /api/v1/roles', function () {
      it('should not get roles', function (done) {
        chai
          .request(app)
          .get('/api/v1/roles/')
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

    describe('GET /api/v1/user', function () {
      it('should return user data', function (done) {
        chai
          .request(app)
          .get('/api/v1/user/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('id').eql(3)
            res.body.should.have.property('eid').eql('test-student-2')
            res.body.should.have.property('name').eql('Test Student 2')
            done()
          })
      })
    })
    describe('POST /api/v1/user', function () {
      it('should update user data', function (done) {
        chai
          .request(app)
          .post('/api/v1/user/')
          .type('json')
          .send({
            user: {
              eid: 'changed-eid', // cannot change
              name: 'New Name',
              contact_info: 'New Contact Info',
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/user/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.has.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('id').eql(3)
                res.body.should.have.property('eid').eql('test-student-2')
                res.body.should.have.property('name').eql('New Name')
                res.body.should.have
                  .property('contact_info')
                  .eql('New Contact Info')
                done()
              })
          })
      })
    })
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

    describe('GET /api/v1/user', function () {
      it('should return user data', function (done) {
        chai
          .request(app)
          .get('/api/v1/user/')
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.has.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('id').eql(4)
            res.body.should.have.property('eid').eql('test-student-3')
            res.body.should.have.property('name').eql('Test Student 3')
            done()
          })
      })
    })
    describe('POST /api/v1/user', function () {
      it('should update user data', function (done) {
        chai
          .request(app)
          .post('/api/v1/user/')
          .type('json')
          .send({
            user: {
              eid: 'changed-eid', // cannot change
              name: 'New Name',
              contact_info: 'New Contact Info',
            },
          })
          .auth(token, { type: 'bearer' })
          .end((err, res) => {
            res.should.have.status(204)
            chai
              .request(app)
              .get('/api/v1/user/')
              .auth(token, { type: 'bearer' })
              .end((err, res) => {
                res.should.has.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('id').eql(4)
                res.body.should.have.property('eid').eql('test-student-3')
                res.body.should.have.property('name').eql('New Name')
                res.body.should.have
                  .property('contact_info')
                  .eql('New Contact Info')
                done()
              })
          })
      })
    })
  }) // end student 2 tests
})
