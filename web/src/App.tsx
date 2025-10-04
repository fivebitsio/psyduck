import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from './context/auth-context'
import Routes from './routes'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
