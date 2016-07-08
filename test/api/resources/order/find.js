import should from 'should'
import async from 'async'
import test from 'supertest'
import api from '../../../../api'
import { admin as mockAdmin, user as mockUser } from '../../../mocks/users'
import { productSource as mockProduct } from '../../../mocks/products'
import { order } from '../../../mocks/orders'
import User from '../../../../api/resources/user/model'
import Order from '../../../../api/resources/order/model'
import Product from '../../../../api/resources/product/model'

describe('order:find', function () {
  let userInstance = test.agent(api)
  let adminInstance = test.agent(api)
  let mockProduct2 = mockProduct
  mockProduct2.id = '433'

  before((done) => {
    User.insert([new User(mockUser), new User(mockAdmin)]).execute(() => {
      userInstance
        .post('/auth/local/start')
        .send({email: mockUser.email, password: mockUser.password})
        .end(() => {
          adminInstance
            .post('/auth/local/start')
            .send({email: mockAdmin.email, password: mockAdmin.password})
            .end(() => {
              async.parallel([
                (cb) => {
                  userInstance
                    .post('/v1/orders')
                    .send({
                      products: [mockProduct]
                    })
                    .end(cb)
                },
                (cb) => {
                  adminInstance
                    .post('/v1/orders')
                    .send({
                      products: [mockProduct2]
                    })
                    .end(cb)
                }
              ], (err, res) => {
                done()
              })
            })
        })
    })
  })

  it('return 200 and the users orders', (done) => {
    userInstance
      .get('/v1/orders')
      .expect(200)
      .end((err, { body }) => {
        should.not.exist(err)
        should.exist(body)
        should.exist(body[0])
        should.not.exist(body[1])
        should.equal(body[0].userId, '123')
        should.exist(body[0].products)
        should.exist(body[0].products[0])
        should.exist(body[0].products[0].id)
        // should.equal(body[0].products[0].id, mockProduct.id)
        done()
      })
  })

  it('return 200 if user.role is admin and list all orders', (done) => {
    adminInstance
      .get('/v1/orders')
      .expect(200)
      .end((err, { body }) => {
        should.not.exist(err)
        should.exist(body)
        should.equal(body.length, 2)
        done()
      })
  })

  after((done) => {
    Order.delete().run().then((e) =>
      User.delete().run().then((e) => done()).error(done)
    ).error(done)
  })
})
