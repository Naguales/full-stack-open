import { Component } from 'react'
import { Alert, AlertTitle, Paper } from '@mui/material'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper
          sx={{ p: 3, borderRadius: 4, border: 1, borderColor: 'divider' }}
        >
          <Alert severity="error" variant="outlined">
            <AlertTitle>Something went wrong</AlertTitle>A rendering error
            occurred in this view. Try navigating to another page or reloading
            the application.
          </Alert>
        </Paper>
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary
