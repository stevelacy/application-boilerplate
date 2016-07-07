import Model from './model'
import Category from '../productcategory/model'

export const isAuthorized = ({ user }) =>
  Model.authorized('create', user)

export const process = ({ user, data }, next) => {
  if (!data.categoryId) return next({status: 400, message: 'invalid parameters'})

  return Category.get(data.categoryId).getJoin({products: true}).run().then((doc) => {
    let model = new Model(data)
    doc.products.push(res)
    return doc.saveAll({products: true})
  })
}

