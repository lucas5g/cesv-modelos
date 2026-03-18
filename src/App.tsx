import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { ModelosPage } from './pages/ModelosPage'

type Theme = 'light' | 'dark'

const THEME_KEY = 'cesv:modelos:theme'

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(THEME_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage theme={theme} onToggleTheme={toggleTheme} />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ModelosPage theme={theme} onToggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
