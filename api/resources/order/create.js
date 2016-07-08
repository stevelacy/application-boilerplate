import moment from 'moment'
import async from 'async'
import { screenDeep } from 'palisade'
import Model from './model'
import User from '../user/model'
import Product from '../product/model'


export const isAuthorized = ({ user }) =>
  Model.authorized('create', user)

export const process = ({user, data}, next) => {

  if (!data.products || data.products && data.products.length === 0) {
    return next({message: 'invalid parameters', status: 400})
  }
  const order = new Model({userId: user.id})

  let products = []

  return new Promise((resolve, rej) => {
    const reject = (e, r, d) => {
      if (e) console.error(e)
      // handle error
      return rej(e, r, d)
    }

    async.each(data.products, (product, cb) => {
      product.sourceId = product.id
      delete product.id
      products.push(new Product(product))
      return cb()
    }, (err) => {
      order.products = products
      order
        .saveAll({products: true}, {returnChanges: true})
        .then(resolve)
        .error(reject)
    })
  })
}

export const format = ({ user }, data) =>
  screenDeep(user, data)

