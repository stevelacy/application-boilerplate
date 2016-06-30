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
  github: {
    id: '8857f73904d006ead64c',
    secret: '534f19a91a67c90119a6769dc7610d87302ca943'
  },
  facebook: {
    id: '1731060577110774',
    secret: '6b555020284d0b1eb25fba9de2473a43',
    scope: [
      'email',
      'public_profile',
      'user_about_me',
      'user_birthday',
      'user_location'
    ]
  }
}
