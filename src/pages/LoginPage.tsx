import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { ApiError } from '../lib/api'
import { isAuthenticated, setToken } from '../lib/auth'
import { loginInterno } from '../lib/modelos'

interface LoginPageProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

function sanitizeCpf(value: string) {
  return value.replace(/\D/g, '')
}

export function LoginPage({ theme, onToggleTheme }: LoginPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCpf = sanitizeCpf(cpf)

    if (!normalizedCpf || !senha.trim()) {
      setError('Preencha CPF e senha para continuar.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const token = (await loginInterno({ cpf: normalizedCpf, senha })).trim()

      if (!token) {
        throw new Error('Token de autenticacao vazio.')
      }

      setToken(token)

      const destination =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

      navigate(destination, { replace: true })
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message)
      } else {
        setError('Ocorreu um erro tecnico ao autenticar. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-shell">
      <button className="theme-toggle login-theme-toggle" onClick={onToggleTheme} type="button">
        {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      </button>

      <LoginForm
        cpf={cpf}
        senha={senha}
        error={error}
        isSubmitting={isSubmitting}
        onCpfChange={(value) => setCpf(sanitizeCpf(value))}
        onSenhaChange={setSenha}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
