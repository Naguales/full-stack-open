import { create } from 'zustand'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

const useUserStore = create((set) => ({
  user: null,
  initializeUser: () => {
    const loggedUser = persistentUser.getUser()

    if (!loggedUser) {
      blogService.setToken(null)
      set({ user: null })
      return null
    }

    blogService.setToken(loggedUser.token)
    set({ user: loggedUser })
    return loggedUser
  },
  setSignedInUser: (user) => {
    blogService.setToken(user?.token ?? null)
    set({ user })
  }
}))

export default useUserStore
