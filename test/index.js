import async from 'async'
import config from 'app-config-chain'
import thinky from '../api/connections/rethink'
import redis from '../api/connections/redis'
import api from '../api'


before((done) => {
  // ensure the env and db is testing
  const tables = [
    'User',
    'Order',
    'Product'
  ]
  async.each(tables, (table, cb) => {
    thinky.r.table(table).delete().run(cb)
  }, done)
})
after(() => {
  thinky.r.getPool().drain()
  if (redis.close) redis.close()
})
