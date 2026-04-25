import { create } from 'zustand'

let timeoutId

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    showNotification: (message, duration = 5000) => {
      clearTimeout(timeoutId)

      set(() => ({
        notification: message,
      }))

      timeoutId = setTimeout(() => {
        set(() => ({
          notification: '',
        }))
      }, duration)
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)
