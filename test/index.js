import thinky from '../api/connections/rethink'
import redis from '../api/connections/redis'
import api from '../api'

after(() => {
  thinky.r.getPool().drain()
  if (redis.close) redis.close()
})
