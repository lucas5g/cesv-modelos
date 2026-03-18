import { clearToken, getToken } from './auth'

const rawBaseUrl = import.meta.env.BASE_URL_API?.trim()
const isDev = import.meta.env.DEV
const API_BASE_URL = isDev ? '' : rawBaseUrl ?? ''

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

async function parseErrorMessage(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  try {
    if (contentType.includes('application/json')) {
      const data = (await response.json()) as Record<string, unknown>
      const message = data.message ?? data.error ?? data.detail

      if (typeof message === 'string' && message.trim()) {
        return message
      }
    }

    const text = await response.text()
    if (text.trim()) {
      return text
    }
  } catch {
    return ''
  }

  if (response.status === 401) {
    return 'Sessao expirada ou credenciais invalidas.'
  }

  return 'Nao foi possivel concluir a solicitacao.'
}

type RequestOptions = RequestInit & {
  requiresAuth?: boolean
  expectText?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.requiresAuth) {
    const token = getToken()

    if (!token) {
      throw new ApiError('Sessao expirada. Faca login novamente.', 401)
    }

    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)

    if (response.status === 401) {
      clearToken()
    }

    throw new ApiError(message, response.status)
  }

  if (options.expectText) {
    return (await response.text()) as T
  }

  return (await response.json()) as T
}

export { ApiError }
