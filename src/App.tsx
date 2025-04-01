import LoginPage from './pages/LoginPage'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <LoginPage />
    </ThemeProvider>
  )
}

export default App
