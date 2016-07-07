const path = require('path')
const modPath = require('app-module-path')
modPath.addPath(path.join(__dirname, '../../api'))

require('babel-register')
require('./compile')
