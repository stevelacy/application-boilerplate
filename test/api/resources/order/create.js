import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import { user as mockUser } from '../../../mocks/users'
import { order as mockOrder } from '../../../mocks/orders'
import { productSource as mockProduct } from '../../../mocks/products'
import User from '../../../../api/resources/user/model'
import Order from '../../../../api/resources/order/model'
import Product from '../../../../api/resources/product/model'

describe('order:create', function () {
  let userInstance = test.agent(api)

  before((done) => {
    User.insert(new User(mockUser)).execute(() => {
      Product.insert(new Product(mockProduct)).execute(() => {
        userInstance
          .post('/auth/local/start')
          .send({email: mockUser.email, password: mockUser.password})
          .end(done)
      })
    })
  })

  it('return 401 if not authenticated', (done) => {
    test(api)
      .post('/v1/orders')
      .send({
        products: [{
        }],
        date: Date.now()
      })
      .expect(401)
      .end((err, res) => {
        done()
      })
  })

  it('return 400 if parameters are missing', (done) => {
    userInstance
      .post('/v1/orders')
      .send({
      })
      .expect(400)
      .end(done)
  })

  it('create an order with products', (done) => {
    userInstance
      .post('/v1/orders')
      .send({
        products: [mockProduct]
      })
      .expect(201)
      .end((err, {body}) => {
        should.exist(body)
        should.exist(body.id)
        Order.get(body.id).getJoin().execute((err, res) => {
          should.exist(body.products)
          should(res.products[0].id === mockProduct.id)
          should.exist(res.user)
          should.exist(res.user.id)
          done()
        })
      })
  })

  after((done) => {
    Order.delete().run().then((e) =>
      User.delete().run().then((e) => done()).error(done)
    ).error(done)
  })
})
