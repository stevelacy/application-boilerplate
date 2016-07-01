import baseConfig from './default'

export default {
  paths: {
    ...baseConfig.paths,
    public: `http://${baseConfig.http.host}:${baseConfig.http.port}/`
  },

  // databases
  redis: 'redis://localhost/3',
  rethink: {
    silent: true,
    host: 'localhost',
    port: 28015,
    db: 'otr_test',
    enforce_extra: 'remove'
  },

}
