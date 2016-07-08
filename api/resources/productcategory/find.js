import decl from 'rethink-decl'
import changeStream from 'rethinkdb-change-stream'
import rethink from '../../connections/rethink'
import Model from './model'

export const tailable = true
export const isAuthorized = () => true

export const process = ({options, tail}, cb) => {
  const q = Model.orderBy({index: rethink.r.desc('created')})
  const joins = {
    products: true
  }

  return tail
    ? changeStream({
        query: q.changes({includeInitial: true}),
        joins
      })
    : q.getJoin(joins).execute()
}
