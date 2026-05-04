import { createContext, useContext, useRef, useState } from 'react'

const NotificationContext = createContext(null)

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState('')
  const timeoutRef = useRef(null)

  const showNotification = (message) => {
    setNotification(message)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setNotification('')
      timeoutRef.current = null
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

const useNotificationContext = () => useContext(NotificationContext)

export const useNotificationValue = () => {
  const { notification } = useNotificationContext()
  return notification
}

export const useNotify = () => {
  const { showNotification } = useNotificationContext()
  return showNotification
}
