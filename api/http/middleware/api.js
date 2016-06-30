import sutro, { load, errorHandler } from 'sutro'
import config from 'app-config-chain'

const logger = (req, res, next) => {
  console.log(req.params)
  return next()
}
export default sutro({
  prefix: config.api.path,
  resources: load(config.paths.resources),
  plugins: [logger, errorHandler]
})
