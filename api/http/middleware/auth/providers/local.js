import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import * as redirect from '../redirect'
import User from 'resources/user/model'
import { salt } from 'app-config-chain'
import sha256 from '../sha256'

const providerName = 'local'
const dataToUser = (username, password) => ({
  email: username,
  [providerName]: {
    id: username,
    accessToken: sha256(`${providerName}-${password}-${salt}`)
  }
})

const isPasswordEqual = (a, b) =>
  a[providerName].accessToken === b[providerName].accessToken

const getUserById = (id, cb) => {
  User.get(id).run((err, existing) => {
    if (err && err.name !== 'DocumentNotFoundError') {
      return cb(err)
    }
    cb(null, existing)
  })
}

const UpdateUser = (usr, cb) => {
  usr.lastLogin = Date.now()
  usr.failedLogins = 0
  User.get(usr.id).update(usr).execute((err, res) => {
    cb(err, res)
  })
}

const findUser = (req, email, password, cb) => {
  let maybeUser = dataToUser(email, password)
  User.filter({ email }).run().then((existingUser) => {
    existingUser = existingUser[0]
    if (req.body.register) {
      if (existingUser) {
        return cb(null, false, {message: 'Email is already registered'})
      }
      // register user
      User.insert(new User(maybeUser), {returnChanges: true}).execute((err, res) => {
        return cb(null, new User(res.changes[0].new_val))
      })
      .error(cb)
    }
    else {
      if (!existingUser) return cb(null, false, {message: 'Invalid email or password'})
      if (existingUser[providerName].accessToken !== maybeUser[providerName].accessToken) {
        existingUser.failedLogins++
        return User.get(existingUser.id).update(existingUser).run().then(() =>
          cb(null, false, {message: 'Invalid email or password'})
        )
      }
      return UpdateUser(existingUser, cb)
    }
  })
}

const strategy = new Strategy({
  usernameField: 'email',
  passReqToCallback: true
}, findUser)
passport.use(strategy)

const start = passport.authenticate(providerName)
const router = Router({ mergeParams: true })
router.post(`/auth/${providerName}/start`, redirect.pre, start, redirect.postBody)

export default router
