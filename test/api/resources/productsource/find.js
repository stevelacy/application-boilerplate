import should from 'should'
import test from 'supertest'
import api from '../../../../api'
import { productSource as mockProductSource } from '../../../mocks/products'
import ProductSource from '../../../../api/resources/productsource/model'

describe('productsource:find', function () {
  let mockProduct = new ProductSource(mockProductSource)

  const opts = {
    url: '/v1/productsources'
  }
  before((done) => {
    mockProduct.save().then(() => done())
  })

  it('return 200 and the product sources as public', (done) => {
    test(api)
      .get(opts.url)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        should.exist(res.body[0])
        should.exist(res.body[0].id)
        should.equal(res.body.length, 1)
        done()
      })
  })

  after((done) => {
    ProductSource.delete().run().then((e) => done()).error(done)
  })
})
