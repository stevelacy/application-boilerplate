import rethink from 'connections/rethink'
import palisade from 'palisade'
import User from '../user/model'
import isOwner from 'lib/isOwner'
const { type } = rethink

const Model = rethink.createModel('Order', {
  // core fields
  id: type.string(),
  userId: type.string(),
  created: type.date().default(Date.now),
  lastModified: type.date().default(Date.now),
  // data fields
  status: type.string().default('new_order'),
  date: type.date(),
  first: type.boolean().default(false),
  paid: type.boolean().default(false),
  wash: type.number().default(0)
})

Model.ensureIndex('created')
Model.ensureIndex('status')
Model.ensureIndex('userId')

Model.ready().then(() => {
  // import and set up relationships here
  Model.belongsTo(User, 'user', 'userId', 'id')
})

palisade(Model, {
  document: {
    read: [ 'admin', isOwner ],
    list: [ 'admin', 'loggedIn' ],
    create: [ 'admin', 'loggedIn' ],
    update: [ 'admin', isOwner],
    replace: [ 'admin' ],
    delete: [ 'admin' ]
  },
  read: {
    id: [ 'admin', isOwner],
    userId: [ 'admin', isOwner],
    created: [ 'admin', isOwner],
    status: [ 'admin', isOwner],
    products: ['admin', isOwner ],
    date: [ 'admin', isOwner],
    first: [ 'admin' ],
    paid: [ 'admin' ],
    wash: [ 'admin' ],
    user: [ 'admin' ],
    lastModified: [ 'admin' ],
    lastLogin: [ 'admin' ]
  },
  write: {
    status: [ 'admin' ],
    products: [ 'admin', isOwner],
    date: [ 'admin', isOwner],
    paid: [ 'admin' ],
    wash: [ 'admin' ],
  }
})

Model.pre('save', function (next) {
  this.lastModified = Date.now()
  next()
})

export default Model
