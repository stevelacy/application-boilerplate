import rethink from 'connections/rethink'
import palisade from 'palisade'
import isOwner from 'lib/isOwner'
import Order from '../user/model'

const { type } = rethink

const Model = rethink.createModel('User', {
  // core fields
  id: type.string(),
  role: type.string().enum([
    'pleb',
    'admin'
  ]).default('pleb'),

  created: type.date().default(Date.now),
  lastModified: type.date().default(Date.now),
  lastLogin: type.date().default(Date.now),
  verified: type.boolean().default(false),
  failedLogins: type.number().default(0),

  // auth info
  local: {
    id: type.string(),
    accessToken: type.string()
  },

  // user info
  name: type.string(),
  email: type.string().email(),
  location: type.string()
})

Model.ensureIndex('created')

Model.ready().then(() => {
  // import and set up relationships here
  Model.hasMany(Order, 'orders', 'id', 'userId')
})

palisade(Model, {
  document: {
    read: [ 'admin', 'self' ],
    list: [ 'admin', 'self' ],
    create: [ 'admin' ],
    update: [ 'admin', 'self' ],
    replace: [ 'admin' ],
    delete: [ 'admin' ]
  },
  read: {
    id: [ 'admin', 'self' ],
    role: [ 'admin', 'self' ],
    name: [ 'admin', 'self' ],
    location: [ 'admin', 'self' ],
    created: [ 'admin', 'self' ],
    lastModified: [ 'admin', 'self' ],
    lastLogin: [ 'admin', 'self' ],
    email: [ 'admin', 'self' ]
  },
  write: {
    role: [ 'admin' ],
    name: [ 'admin', 'self' ],
    email: [ 'admin', 'self' ],
    location: [ 'admin', 'self' ],
  }
})

// other junk
Model.pre('save', function (next) {
  this.lastModified = Date.now()
  next()
})

export default Model
