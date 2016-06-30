/* eslint spaced-comment:0 */
import path from 'path'

const basePath = path.resolve(__dirname, '../')
const config = {
  // core stuff
  env: process.env.NODE_ENV,

  paths: {
    base: basePath,
    public: '/',
    client: path.join(basePath, './client'),
    dist: path.join(basePath, './dist'),
    server: path.join(basePath, './api'),
    resources: path.join(basePath, './api/resources')
  },

  // http stuff
  http: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    url: 'localhost:3000'
  },

  salt: 'password-secret-salt-1337',
  cookie: {
    name: 'x',
    secret: 'stack-cookie-secret-1337'
  },

  api: {
    path: '/v1'
  }
}

export default config
