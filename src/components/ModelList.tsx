import type { ModeloListItem } from '../types/modelo'

interface ModelListProps {
  items: ModeloListItem[]
  selectedId: number | null
  isLoading: boolean
  error: string | null
  onSelect: (item: ModeloListItem) => void
}

function displayValue(value?: string | null) {
  return value && value.trim() ? value : '-'
}

export function ModelList({ items, selectedId, isLoading, error, onSelect }: ModelListProps) {
  if (isLoading) {
    return <div className="panel-state">Carregando modelos...</div>
  }

  if (error) {
    return <div className="panel-state panel-state-error">{error}</div>
  }

  if (!items.length) {
    return <div className="panel-state">Nenhum modelo encontrado.</div>
  }

  return (
    <div className="model-list" role="list">
      {items.map((item) => {
        const isSelected = item.co_seq_modelo === selectedId

        return (
          <button
            key={item.co_seq_modelo}
            className={`model-row${isSelected ? ' selected' : ''}`}
            onClick={() => onSelect(item)}
            type="button"
          >
            <strong>{displayValue(item.no_modelo)}</strong>
            <span>{displayValue(item.ds_assunto_email)}</span>
          </button>
        )
      })}
    </div>
  )
}
