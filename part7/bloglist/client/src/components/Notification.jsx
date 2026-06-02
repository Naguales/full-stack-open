import Alert from '@mui/material/Alert'
import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const notification = useNotificationStore((state) => state.notification)

  if (!notification) {
    return null
  }

  return (
    <Alert
      severity={notification.type}
      variant="filled"
      sx={{ mb: 3, alignItems: 'center', borderRadius: 2 }}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification
