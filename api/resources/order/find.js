import decl from 'rethink-decl'
import { screenDeep } from 'palisade'
import rethink from 'connections/rethink'
import Model from './model'
import changeStream from 'rethinkdb-change-stream'

export const tailable = true
export const isAuthorized = ({ user }) =>
  Model.authorized('list', user)

export const process = ({ options, tail }) => {
  const joins = {
    user: true,
    products: true
  }
  const query = Model.orderBy({index: rethink.r.asc('created')})
  return tail
    ? changeStream(query.changes({ includeInitial: true }))
    : query.getJoin(joins).execute()
}

export const format = ({ user }, data) =>
  screenDeep(user, data)
