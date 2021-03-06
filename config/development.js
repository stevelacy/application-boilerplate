import baseConfig from './default'

export default {
  paths: {
    ...baseConfig.paths,
    public: `http://${baseConfig.http.host}:${baseConfig.http.port}/`
  },

  // databases
  redis: 'redis://localhost/2',
  rethink: {
    silent: true,
    host: 'localhost',
    port: 28015,
    db: 'otr_local',
    enforce_extra: 'remove'
  },

  // auth stuff
}
