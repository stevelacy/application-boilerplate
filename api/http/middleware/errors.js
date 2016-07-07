import { env } from 'app-config-chain'
// import log from 'lib/log'

export default (err, req, res, next) => {
  const status = (err.cause && err.cause.status) ? err.cause.status : err.status || 500
  const error = {
    status,
    error: err.message,
    cause: err.cause ? err.cause.toString() : undefined
  }
  // log(error)
  res.status(error.status)
  if (env !== 'production') {
    res.json(error)
  }
  res.end()
}
