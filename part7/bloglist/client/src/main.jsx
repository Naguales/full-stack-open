import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    primary: {
      main: '#0062FF',
      contrastText: '#F8FAFC'
    },
    secondary: {
      main: '#00D4FF',
      contrastText: '#0F172A'
    },
    error: {
      main: '#7000FF'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A'
    },
    success: {
      main: '#00D4FF'
    }
  },
  typography: {
    button: {
      fontWeight: 700,
      letterSpacing: '0.05em'
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
)
