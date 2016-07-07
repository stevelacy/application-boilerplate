import should from 'should'
import test from 'supertest'
import api from '../../../api'
import { user as mockUser } from '../../mocks/users'
import User from '../../../api/resources/user/model'

describe('auth:login', () => {
  before((done) => {
    User.insert(new User(mockUser)).execute(done)
  })

  it('return 400 with missing options', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({})
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        done()
      })
  })

  it('return 400 with invalid password or email', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: 'wat',
        password: 'meh'
      })
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        should.equal(res.text, 'Invalid email or password')
        done()
      })
  })

  it('return 200 with valid password and email', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: 'valid@email.co',
        password: 'testpass'
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body.me)
        should.equal(res.body.me.email, mockUser.email)
        should.equal(res.body.me.role, 'pleb')
        should.exist(res.headers['set-cookie'][0])
        done()
      })
  })

  it('return 400 with valid email and invalid password', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: 'valid@email.co',
        password: 'invalidpass'
      })
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        done()
      })
  })

  it('update user failedLogins count with valid email and invalid password', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: 'valid@email.co',
        password: 'invalidpass'
      })
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        User.get('123').run().then((doc) => {
          should(doc.failedLogins).be.above(1)
          done()
        })
      })
  })

  it('reset user failedLogins count with valid email and password', (done) => {
    test(api)
      .post('/auth/local/start')
      .send({
        email: 'valid@email.co',
        password: 'testpass'
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        User.get('123').run().then((doc) => {
          should.equal(doc.failedLogins, 0)
          done()
        })
      })
  })

  after((done) => {
    User.delete().run().then((e) => done()).error(done)
  })
})

