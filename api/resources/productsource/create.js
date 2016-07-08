import { screenDeep } from 'palisade'
import Model from './model'
import Category from '../productcategory/model'

export const isAuthorized = ({ user }) =>
  Model.authorized('create', user)

export const process = ({ user, data }, cb) => {
  if (!data.categoryId) return cb({status: 400})

  const categoryId = data.categoryId
  delete data.categoryId
  let model = new Model(data)
  model.categoryId = categoryId
  return new Promise((resolve, reject) => {
    model.saveAll().then((res) => {
      Category.get(categoryId).getJoin({products: true}).run().then((doc) => {
        doc.products.push(res)
        doc.saveAll({products: true})
          .then(() => resolve(res))
          .error(reject)
      })
    }).error(reject)
  })
}

export const format = ({ user }, data) =>
  screenDeep(user, data)
