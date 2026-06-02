import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (notification) => set({ notification }),
  clearNotification: () => set({ notification: null })
}))

export default useNotificationStore
