export default ({ user, data }) => {
  if (!data) return false
  if (!data.id) return true
  return String(user.id) === String(data.userId)
}
