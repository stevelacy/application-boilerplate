import Model from './model'
import decl from 'rethink-decl'
import { screenDeep } from 'palisade'
import changeStream from 'rethinkdb-change-stream'

export const tailable = false
export const isAuthorized = ({ user }) =>
  Model.authorized('list', user)

export const process = ({ options }) => {
  const query = decl(Model, options)
  return query.run()
}

export const format = ({ user }, data) =>
  screenDeep(user, data)
