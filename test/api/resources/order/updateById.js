import should from 'should'
import async from 'async'
import test from 'supertest'
import api from '../../../../api'
import { admin as mockAdmin, user as mockUser } from '../../../mocks/users'
import { productSource as mockProduct } from '../../../mocks/products'
import { order } from '../../../mocks/orders'
import User from '../../../../api/resources/user/model'
import Product from '../../../../api/resources/product/model'

describe('order:updateById', function () {
  let userInstance = test.agent(api)
  let adminInstance = test.agent(api)
  let mockOrder1 = {
    products: [mockProduct]
  }
  let mockOrder2 = {
    products: [mockProduct]
  }
  before((done) => {
    User.insert([new User(mockUser), new User(mockAdmin)]).execute(() => {
      userInstance
        .post('/auth/local/start')
        .send(mockUser)
        .end(() => {
          adminInstance
            .post('/auth/local/start')
            .send(mockAdmin)
            .end(() => {
              async.parallel([
                (cb) => {
                  userInstance
                    .post('/v1/orders')
                    .send(mockOrder1)
                    .end((err, {body}) => {
                      mockOrder1.id = body.id
                      cb()
                    })
                },
                (cb) => {
                  adminInstance
                    .post('/v1/orders')
                    .send(mockOrder2)
                    .end((err, {body}) => {
                      mockOrder2.id = body.id
                      cb()
                    })
                }
              ], (err, res) => {
                done()
              })
            })
        })
    })
  })


  it('return 401 on another users order', (done) => {
    userInstance
      .patch('/v1/orders/' + mockOrder2.id)
      .send({products: [{}]})
      .expect(401)
      .end((err, res) => {
        should.not.exist(err)
        done()
      })
  })
  it('return 200 and update order', (done) => {
    const date = String(new Date())
    userInstance
      .patch('/v1/orders/' + mockOrder1.id)
      .send({ date })
      .expect(200)
      .end((err, { body }) => {
        should.not.exist(err)
        should.equal(body.date, date)
        done()
      })
  })

  it('return 200 and update if user.role is admin', (done) => {
    const date = String(new Date())
    adminInstance
      .patch('/v1/orders/' + mockOrder1.id)
      .send({ date })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        should.equal(res.body.date, date)
        done()
      })
  })

  after((done) => {
    User.delete().run().then((e) => done()).error(done)
  })
})
