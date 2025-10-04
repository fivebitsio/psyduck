import { ThemeProvider } from '@/components/theme-provider'
import Routes from './routes'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes />
    </ThemeProvider>
  )
}

export default App
