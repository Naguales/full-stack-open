const storageKey = 'loggedBlogappUser'

const getUser = () => {
  const userJSON = window.localStorage.getItem(storageKey)

  if (!userJSON) {
    return null
  }

  return JSON.parse(userJSON)
}

const saveUser = (user) => {
  window.localStorage.setItem(storageKey, JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem(storageKey)
}

export default { getUser, saveUser, removeUser }
