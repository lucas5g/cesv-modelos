import { apiRequest } from './api'
import type { ModeloDetail, ModeloListItem } from '../types/modelo'

interface ApiEnvelope<T> {
  mensagem?: string
  dados: T
}

function unwrapEnvelope<T>(response: T | ApiEnvelope<T>) {
  if (
    response &&
    typeof response === 'object' &&
    'dados' in response
  ) {
    return response.dados as T
  }

  return response as T
}

export interface LoginPayload {
  cpf: string
  senha: string
}

export async function loginInterno(payload: LoginPayload) {
  return apiRequest<string>('/scsdp/service/login/interno', {
    method: 'POST',
    body: JSON.stringify(payload),
    expectText: true,
  })
}

export async function fetchModelos() {
  const response = await apiRequest<ApiEnvelope<ModeloListItem[]>>('/candidato/service/modelos', {
    method: 'GET',
    requiresAuth: true,
  })

  const dados = unwrapEnvelope<ModeloListItem[]>(response)

  return Array.isArray(dados) ? dados : []
}

export async function fetchModeloDetail(coSeqModelo: number) {
  const response = await apiRequest<ModeloDetail | ApiEnvelope<ModeloDetail>>(
    `/candidato/service/modelos/${coSeqModelo}`,
    {
    method: 'GET',
    requiresAuth: true,
    },
  )

  return unwrapEnvelope<ModeloDetail>(response)
}
