import { ThemeProvider } from '@/components/theme-provider'
import Analytics from '@/pages/analytics/analytics'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Analytics />
    </ThemeProvider>
  )
}

export default App
