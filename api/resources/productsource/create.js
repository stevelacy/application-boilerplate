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
  return model.saveAll().then((res) => {
    return Category.get(categoryId).getJoin({products: true}).run().then((doc) => {
      doc.products.push(res)
      return doc.saveAll({products: true})
    })
  })
}
