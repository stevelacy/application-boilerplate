import Model from './model'
import { screenDeep } from 'palisade'

export const isAuthorized = ({ user, id }) =>
  Model.authorized('update', user, { id })

export const process = ({ user, id, data }, cb) => {
  if (!data.id) data.id = id

  return new Promise((resolve, reject) => {
    Model.get(id).run().then((res) => {
      if (user.role !== 'admin' && user.id !== res.userId) return reject({status: 401})
      return resolve(Model.get(id).update(data, { returnChanges: true }).run())
    })
  })
}

export const format = ({ user }, data) =>
  screenDeep(user, data)
