import dbg from 'debug'
import { env } from 'app-config-chain'

const debug = dbg('app')

export default (opts) => debug(opts)

export const createLogger = ({ name, file, sensitive }) => {
  const local = dbg(name)
  return (...a) => {
    if (env === 'testing') return
    local(...a)
  }
}
