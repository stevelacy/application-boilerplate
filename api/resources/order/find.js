import decl from 'rethink-decl'
import { screenDeep } from 'palisade'
import rethink from 'connections/rethink'
import Model from './model'
import changeStream from 'rethinkdb-change-stream'

export const tailable = false
export const isAuthorized = ({ user }) =>
  Model.authorized('list', user)

export const process = ({ options }) => {
  const joins = {
    user: true,
    products: true
  }
  const query = Model.orderBy({index: rethink.r.asc('created')})
  return query.getJoin(joins).execute()
}

export const format = ({ user }, data) =>
  screenDeep(user, data)
