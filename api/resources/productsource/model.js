import rethink from 'connections/rethink'
import palisade from 'palisade'
import isOwner from 'lib/isOwner'
import Category from '../productcategory/model'
const { type } = rethink

const Model = rethink.createModel('ProductSource', {
  // core fields
  id: type.string(),
  created: type.date().default(Date.now),
  lastModified: type.date().default(Date.now),
  // data fields
  name: type.string(),
  gender: type.string(),
  image: type.string(),
  description: type.string(),
  sku: type.string(),
  enabled: type.boolean()
})

Model.ensureIndex('created')

Model.ready().then(() => {
  Model.ensureIndex('created')
  Model.belongsTo(Category, 'category', 'categoryId', 'id')
})

palisade(Model, {
  document: {
    read: [ 'public' ],
    list: [ 'public' ],
    create: [ 'admin' ],
    update: [ 'admin' ],
    replace: [ 'admin' ],
    delete: [ 'admin' ]
  },
  read: {
    id: [ 'public' ],
    name: [ 'public' ],
    gender: [ 'public' ],
    image: [ 'public' ],
    activity: [ 'public' ],
    description: [ 'public' ],
    sku: [ 'public' ],
    categoryId: [ 'public' ],
    lastModified: [ 'admin' ],
  },
  write: {
    status: [ 'admin' ],
    sku: [ 'admin' ],
    uid: [ 'admin' ],
    image: [ 'admin' ],
    gender: [ 'admin' ],
    description: [ 'admin' ],
    name: [ 'admin' ], enabled: [ 'admin' ]
  }
})

Model.pre('save', function (next) {
  this.lastModified = Date.now()
  next()
})

export default Model
