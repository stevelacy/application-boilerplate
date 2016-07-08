import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import {
  productCategory as mockProductCategory,
  productSource as mockProductSource
} from '../../../mocks/products'
import ProductCategory from '../../../../api/resources/productcategory/model'
import ProductSource from '../../../../api/resources/productsource/model'

describe('productcategory:find', function () {
  let mockCategory = new ProductCategory(mockProductCategory)
  let mockProduct = new ProductSource(mockProductSource)
  mockProduct.categoryId = mockCategory.id

  const opts = {
    url: '/v1/productcategories'
  }
  before((done) => {
    mockCategory.save().then(() =>
      mockProduct.save().then(() => done())
    )
  })

  it('return 200 and the product sources as public', (done) => {
    test(api)
      .get(opts.url)
      .expect(200)
      .end((err, { body }) => {
        should.not.exist(err)
        should.exist(body)
        should.exist(body[0])
        should.exist(body[0].id)
        should.exist(body[0].products)
        should.exist(body[0].products[0])
        should.equal(body[0].products[0].categoryId, mockCategory.id)
        should.equal(body.length, 1)
        done()
      })
  })

  after((done) => {
    ProductCategory
      .delete()
      .run()
      .then(() =>
        ProductSource
          .delete()
          .run()
          .then(() =>
            done()
          )).error(done)
  })
})
