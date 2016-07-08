import rethink from 'connections/rethink'
import palisade from 'palisade'
import isOwner from 'lib/isOwner'
import User from '../user/model'
import ProductSource from '../productsource/model'
const { type } = rethink

const Model = rethink.createModel('ProductCategory', {
  // core fields
  id: type.string(),
  created: type.date().default(Date.now).required(),
  name: type.string(),
  description: type.string(),
  category: type.string(),
  sizes: type.array().default(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
})

Model.ready().then(() => {
  Model.ensureIndex('created')
  const Product = require('../productsource/model')
  Model.hasMany(Product, 'products', 'id', 'categoryId')
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
    name: [ 'pubic' ],
    description: [ 'public' ],
    category: [ 'public' ],
    lastModified: [ 'admin' ],
  },
  write: {
    name: [ 'pubic' ],
    description: [ 'public' ],
    category: [ 'public' ],
    lastModified: [ 'admin' ]
  }
})

Model.pre('save', function (next) {
  this.lastModified = Date.now()
  next()
})

export default Model
