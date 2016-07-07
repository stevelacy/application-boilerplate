import should from 'should'
import test from 'supertest'
import api from '../../../api'
import { user as mockUser } from '../../mocks/users'
import User from '../../../api/resources/user/model'

describe('auth:register', () => {
  before((done) => {
    User.insert(new User(mockUser)).execute(done)
  })

  it('return 400 with missing email and password', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({register: true})
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        should.equal(res.text, 'Missing credentials')
        done()
      })
  })

  it('return 400 if email exists', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: mockUser.email,
        password: 'meh'
      })
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        should.equal(res.text, 'Invalid email or password')
        done()
      })
  })

  it('return 200 and register unique user', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: 'second@email.co',
        password: 'testpass',
        register: true
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body.me)
        should.equal(res.body.me.email, 'second@email.co')
        should.equal(res.body.me.role, 'pleb')
        should.exist(res.headers['set-cookie'][0])
        User.get(res.body.me.id).run().then((doc) => {
          should.exist(doc)
          should.equal(doc.email, 'second@email.co')
          done()
        })
      })
  })

  after((done) => {
    User.delete().run().then((e) => done()).error(done)
  })
})

