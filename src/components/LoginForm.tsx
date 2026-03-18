import type { FormEvent } from 'react'

interface LoginFormProps {
  cpf: string
  senha: string
  error: string | null
  isSubmitting: boolean
  onCpfChange: (value: string) => void
  onSenhaChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LoginForm({
  cpf,
  senha,
  error,
  isSubmitting,
  onCpfChange,
  onSenhaChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form className="login-card" onSubmit={onSubmit}>
      <div className="brand-lockup">
        <span className="eyebrow">Area interna</span>
        <h1>Consulta de modelos de texto</h1>
        <p>
          Entre com seu CPF e senha para consultar modelos de email e template da
          aplicacao.
        </p>
      </div>

      <label className="field">
        <span>CPF</span>
        <input
          autoComplete="username"
          inputMode="numeric"
          name="cpf"
          placeholder="Somente numeros"
          value={cpf}
          onChange={(event) => onCpfChange(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Senha</span>
        <input
          autoComplete="current-password"
          name="senha"
          placeholder="Digite sua senha"
          type="password"
          value={senha}
          onChange={(event) => onSenhaChange(event.target.value)}
        />
      </label>

      {error ? <div className="feedback feedback-error">{error}</div> : null}

      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Autenticando...' : 'Entrar'}
      </button>
    </form>
  )
}
