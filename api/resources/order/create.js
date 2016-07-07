import moment from 'moment'
import { screenDeep } from 'palisade'
import Model from './model'
import User from '../user/model'


export const isAuthorized = ({ user }) =>
  Model.authorized('create', user)

export const process = ({ user, data }) => {
  const doc = Model.screen('write', user, data)
  return Model.insert(new Model(doc), { returnChanges: true }).run()
}

export const format = ({ user }, data) =>
  screenDeep(user, data)

