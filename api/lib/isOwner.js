export default ({ user, data }) => {
  if (!data) return false
  return String(user.id) === String(data.userId)
}
