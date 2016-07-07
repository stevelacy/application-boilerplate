require('babel-register')
require('app-module-path/register')
var pmx = require('pmx').init()
var config = require('app-config-chain')
var server = require('./http')
var debug = require('lib/debug').default
var chalk = require('chalk')

process.on('warning', (warning) => {
  debug(warning)
  console.warn(warning.stack)
})

// Log unhandled promise rejections.
process.on('unhandledRejection', (reason) => {
  debug(reason)
  process.exit(1)
})

// Log uncaught exceptions.
process.on('uncaughtException', (err) => {
  debug(err)
  process.exit(1)
})

function init () {
  server.listen(config.http.port, config.http.host, () =>
    debug(`Server started on: ${config.http.host}:${config.http.port}`)
  )
}
if (!module.parent) {
  init()
}

module.exports.init = init
module.exports = server
