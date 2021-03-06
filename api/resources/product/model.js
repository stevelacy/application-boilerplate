import rethink from 'connections/rethink'
import palisade from 'palisade'
import isOwner from 'lib/isOwner'
import User from '../user/model'
import Order from '../order/model'
const { type } = rethink

const Model = rethink.createModel('Product', {
  // core fields
  id: type.string(),
  created: type.date().default(Date.now),
  lastModified: type.date().default(Date.now),
  // data fields
  name: type.string(),
  gender: type.string(),
  image: type.string(),
  activity: type.string(),
  description: type.string(),
  sku: type.string(),
  uid: type.string(),
  sourceId: type.string()
})

Model.ensureIndex('created')

Model.ready().then(() => {
  // import and set up relationships here
  Model.hasAndBelongsToMany(Order, 'orders', 'id', 'id')
})

palisade(Model, {
  document: {
    read: [ 'admin', 'loggedIn' ],
    list: [ 'admin', 'loggedIn' ],
    create: [ 'admin' ],
    update: [ 'admin' ],
    replace: [ 'admin' ],
    delete: [ 'admin' ]
  },
  read: {
    id: [ 'admin', isOwner],
    created: [ 'admin' ],
    status: [ 'admin', 'loggedIn' ],
    description: ['admin', 'loggedIn' ],
    lastModified: [ 'admin' ],
    sku: [ 'admin' ],
    uid: [ 'admin' ]
  },
  write: {
    status: [ 'admin' ],
    gender: [ 'admin' ],
    description: [ 'admin' ],
    sku: [ 'admin' ],
    uid: [ 'admin' ]
  }
})

Model.pre('save', function (next) {
  this.lastModified = Date.now()
  next()
})

export default Model
