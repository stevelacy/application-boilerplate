import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import { admin as mockAdmin, user as mockUser } from '../../../mocks/users'
import User from '../../../../api/resources/user/model'

describe('user:findById', function () {
  let userInstance = test.agent(api)
  let adminInstance = test.agent(api)
  before((done) => {
    User.insert([new User(mockUser), new User(mockAdmin)]).execute((err, docs) => {
      userInstance
        .post('/auth/local/start')
        .send({email: mockUser.email, password: mockUser.password})
        .end((err, res) => {
          adminInstance
            .post('/auth/local/start')
            .send({email: mockAdmin.email, password: mockAdmin.password})
            .end(done)
        })
    })
  })

  it('return 401 on another user', (done) => {
    userInstance
      .get('/v1/users/124')
      .expect(401)
      .end((err, res) => {
        should.not.exist(err)
        done()
      })
  })
  it('return 200 and data on self', (done) => {
    userInstance
      .get('/v1/users/123')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.equal(res.body.id, 123)
        should.not.exist(res.body.local)
        should.not.exist(res.body.password)
        done()
      })
  })

  it('return 200 if user.role is admin', (done) => {
    adminInstance
      .get('/v1/users')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        should.equal(res.body.length, 2)
        done()
      })
  })

  after((done) => {
    User.delete().run().then((e) => done()).error(done)
  })
})
