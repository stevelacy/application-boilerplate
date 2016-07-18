import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import { admin as mockAdmin, user as mockUser } from '../../../mocks/users'
import {
  productSource as mockProduct,
  productCategory as mockCategory
} from '../../../mocks/products'
import User from '../../../../api/resources/user/model'
import ProductSource from '../../../../api/resources/productsource/model'
import ProductCategory from '../../../../api/resources/productcategory/model'


describe('productsource:create', function () {
  let userInstance = test.agent(api)
  let adminInstance = test.agent(api)
  const opts = {
    url: '/v1/productsources'
  }

  before((done) => {
    User.insert([new User(mockUser), new User(mockAdmin)]).execute(() => {
      ProductCategory
        .insert(new ProductCategory(mockCategory))
        .execute((err, res) => {
          mockProduct.categoryId = mockCategory.id
          mockProduct.gender = 'male'
          ProductSource
            .insert(new ProductSource(mockProduct))
            .execute((err, res) => {
              userInstance
                .post('/auth/local/start')
                .send({email: mockUser.email, password: mockUser.password})
                .end(() => {
                  adminInstance
                    .post('/auth/local/start')
                    .send({email: mockAdmin.email, password: mockAdmin.password})
                    .end(done)
                })
        })
      })
    })
  })

  it('return 401 if not authenticated', (done) => {
    test(api)
      .post(opts.url)
      .send({})
      .expect(401)
      .end(done)
  })

  it('return 401 if user.role is not admin', (done) => {
    userInstance
      .post(opts.url)
      .send({
        image: 'test.jpg'
      })
      .expect(401)
      .end((err, res) => {
        should.exist(res.body)
        should.exist(res.body.status)
        should.equal(res.body.status, 401)
        done()
      })
  })

  it('return 400 if missing parameters', (done) => {
    adminInstance
      .post(opts.url)
      .send({
        image: 'wat.jpg',
        category: 'wat',
        description: 'product',
        sizes: ['W', 'A', 'T'],
      })
      .expect(400)
      .end(done)
  })

  it('create an product source if user.role is admin', (done) => {
    adminInstance
      .post(opts.url)
      .send({
        image: 'wat.jpg',
        description: 'product',
        sizes: ['W', 'A', 'T'],
        gender: 'female',
        categoryId: mockCategory.id
      })
      .expect(201)
      .end((err, {body}) => {
        should.exist(body)
        should.exist(body.id)
        ProductSource.get(body.id).execute((err, res) => {
          should.exist(res.image)
          should.equal(res.description, 'product')
          done()
        })
      })
  })

  after((done) => {
    ProductSource.delete().run().then((e) =>
      User.delete().run().then((e) => done()).error(done)
    ).error(done)
  })
})
