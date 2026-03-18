import type { ModeloDetail } from '../types/modelo'

interface ModelDetailPanelProps {
  item: ModeloDetail | null
  isLoading: boolean
  error: string | null
}

function displayValue(value?: string | null) {
  return value && value.trim() ? value : '-'
}

function hasHtmlContent(value?: string | null) {
  return Boolean(value && value.trim())
}

export function ModelDetailPanel({ item, isLoading, error }: ModelDetailPanelProps) {
  if (isLoading) {
    return <aside className="detail-panel panel-state">Carregando detalhes...</aside>
  }

  if (error) {
    return <aside className="detail-panel panel-state panel-state-error">{error}</aside>
  }

  if (!item) {
    return (
      <aside className="detail-panel panel-state">
        Selecione um modelo na lista para visualizar os detalhes.
      </aside>
    )
  }

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <span className="eyebrow">Detalhes do modelo</span>
        <h2>{displayValue(item.no_modelo)}</h2>
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Assunto do email</dt>
          <dd>{displayValue(item.ds_assunto_email)}</dd>
        </div>
        <div>
          <dt>Conteudo do modelo</dt>
          <dd>
            {hasHtmlContent(item.ds_conteudo_modelo) ? (
              <div
                className="html-content"
                dangerouslySetInnerHTML={{ __html: item.ds_conteudo_modelo ?? '' }}
              />
            ) : (
              <span className="preformatted">-</span>
            )}
          </dd>
        </div>
        <div>
          <dt>SMS</dt>
          <dd className="preformatted">{displayValue(item.ds_sms)}</dd>
        </div>
      </dl>
    </aside>
  )
}
