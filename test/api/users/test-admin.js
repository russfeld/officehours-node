//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
require('chai').should()

//Require app dependencies
var app = require('../../../app')

//Require Helpers
const { loginAsAdmin } = require('../../helpers')

describe('test-admin /api/v1/users', function () {
  beforeEach(loginAsAdmin)

  describe('GET /', function () {
    it('should return all users', function (done) {
      chai
        .request(app)
        .get('/api/v1/users/')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.should.have.a.lengthOf(4)
          res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
          res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
          res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
          res.body.map(({ id }) => ({ id })).should.deep.include({ id: 4 })
          done()
        })
    })
  })

  describe('POST /:id', function () {
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
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/users/')
            .auth(this.token, { type: 'bearer' })
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
        .auth(this.token, { type: 'bearer' })
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
        .auth(this.token, { type: 'bearer' })
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
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/users/')
            .auth(this.token, { type: 'bearer' })
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
                .auth(this.token, { type: 'bearer' })
                .end((err, res) => {
                  res.should.have.status(200)
                  chai
                    .request(app)
                    .get('/api/v1/users/')
                    .auth(this.token, { type: 'bearer' })
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

  describe('DELETE /:id', function () {
    it('should delete user', function (done) {
      chai
        .request(app)
        .delete('/api/v1/users/4')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200)
          chai
            .request(app)
            .get('/api/v1/users/')
            .auth(this.token, { type: 'bearer' })
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('array')
              res.body.map(({ id }) => ({ id })).should.deep.include({ id: 1 })
              res.body.map(({ id }) => ({ id })).should.deep.include({ id: 2 })
              res.body.map(({ id }) => ({ id })).should.deep.include({ id: 3 })
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
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
    })
    it('should not allow delete self', function (done) {
      chai
        .request(app)
        .delete('/api/v1/users/1')
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          done()
        })
    })
  })

  describe('PUT /', function () {
    it('should create new user', function (done) {
      chai
        .request(app)
        .put('/api/v1/users/')
        .type('json')
        .send({
          eid: 'test-student-4',
        })
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          const new_id = res.body.id
          chai
            .request(app)
            .get('/api/v1/users/')
            .auth(this.token, { type: 'bearer' })
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
        .auth(this.token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('name').eql('ValidationError')
          res.body.data.should.have.property('eid')
          done()
        })
    })
  })
})
