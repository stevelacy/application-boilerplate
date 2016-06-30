import crypto from 'crypto'

export default (str) =>
  crypto.createHash('sha256').update(str).digest('hex')
