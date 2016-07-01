import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import { admin as mockAdmin, user as mockUser } from '../../../mocks/users'
import User from '../../../../api/resources/user/model'

describe('user:delete', function () {
  let userInstance = test.agent(api)
  let adminInstance = test.agent(api)
  before((done) => {
    User.insert([new User(mockUser), new User(mockAdmin)]).execute((err, docs) => {
      if (err) console.log(err)
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

  it('return 401 if user.role is not admin', (done) => {
    userInstance
      .delete('/v1/users/123')
      .expect(401)
      .end((err, res) => {
        should.not.exist(err)
        done()
      })
  })

  it('return 200 if user.role is admin', (done) => {
    adminInstance
      .delete('/v1/users/123')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        User.get('123').run().then().error(() => done())
      })
  })

  after((done) => {
    User.delete().run().then((e) => done()).error(done)
  })
})
