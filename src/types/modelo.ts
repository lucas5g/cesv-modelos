export interface ModeloListItem {
  co_seq_modelo: number
  no_modelo?: string | null
  ds_assunto_email?: string | null
}

export interface ModeloDetail extends ModeloListItem {
  ds_conteudo_modelo?: string | null
  ds_sms?: string | null
}
