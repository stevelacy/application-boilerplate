import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import { admin as mockAdmin, user as mockUser } from '../../../mocks/users'
import { order } from '../../../mocks/orders'
import User from '../../../../api/resources/user/model'
import Order from '../../../../api/resources/order/model'

describe('order:find', function () {
  let userInstance = test.agent(api)
  let adminInstance = test.agent(api)
  let mockOrder = new Order(order)
  mockOrder.userId = '123'
  before((done) => {
    User.insert([new User(mockUser), new User(mockAdmin)]).execute(() => {
      userInstance
        .post('/auth/local/start')
        .send({email: mockUser.email, password: mockUser.password})
        .end((err, res) => {
          mockOrder.saveAll().then(() => {
            adminInstance
              .post('/auth/local/start')
              .send({email: mockAdmin.email, password: mockAdmin.password})
              .end(done)
          })
        })
    })
  })

  it('return 200 and the users orders', (done) => {
    userInstance
      .get('/v1/orders')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        should.exist(res.body[0])
        should.equal(res.body.length, 1)
        should.equal(res.body[0].userId, '123')
        done()
      })
  })

  it('return 200 if user.role is admin and list all orders', (done) => {
    adminInstance
      .get('/v1/orders')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        should.equal(res.body.length, 1)
        should.equal(res.body[0].userId, '123')
        done()
      })
  })

  after((done) => {
    Order.delete().run().then((e) =>
      User.delete().run().then((e) => done()).error(done)
    ).error(done)
  })
})
