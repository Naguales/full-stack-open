import Alert from '@mui/material/Alert'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert severity={notification.type} variant="filled" sx={{ mb: 3, alignItems: 'center', borderRadius: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
