import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ModelDetailPanel } from '../components/ModelDetailPanel'
import { ModelList } from '../components/ModelList'
import { ApiError } from '../lib/api'
import { clearToken } from '../lib/auth'
import { fetchModeloDetail, fetchModelos } from '../lib/modelos'
import type { ModeloDetail, ModeloListItem } from '../types/modelo'

interface ModelosPageProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function ModelosPage({ theme, onToggleTheme }: ModelosPageProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState<ModeloListItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<ModeloDetail | null>(null)
  const [isListLoading, setIsListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  const modeloParam = searchParams.get('modelo')
  const selectedFromUrl = modeloParam ? Number(modeloParam) : null

  const loadDetail = useCallback(async (coSeqModelo: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    setSelectedId(coSeqModelo)
    setSelectedItem(null)
    setIsDetailLoading(true)
    setDetailError(null)

    try {
      const response = await fetchModeloDetail(coSeqModelo)
      setSelectedItem(response)
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        clearToken()
        navigate('/login', { replace: true })
        return
      }

      setDetailError('Nao foi possivel carregar os detalhes do modelo selecionado.')
    } finally {
      setIsDetailLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    let ignore = false

    async function loadModelos() {
      setIsListLoading(true)
      setListError(null)

      try {
        const response = await fetchModelos()

        if (!ignore) {
          setItems(response)
        }
      } catch (caughtError) {
        if (!ignore) {
          if (caughtError instanceof ApiError && caughtError.status === 401) {
            clearToken()
            navigate('/login', { replace: true })
            return
          }

          setListError('Nao foi possivel carregar os modelos.')
        }
      } finally {
        if (!ignore) {
          setIsListLoading(false)
        }
      }
    }

    void loadModelos()

    return () => {
      ignore = true
    }
  }, [navigate])

  useEffect(() => {
    if (isListLoading) {
      return
    }

    if (!selectedFromUrl || Number.isNaN(selectedFromUrl)) {
      setSelectedId(null)
      setSelectedItem(null)
      setDetailError(null)
      setIsDetailLoading(false)
      return
    }

    if (selectedId === selectedFromUrl && (selectedItem || detailError || isDetailLoading)) {
      return
    }

    const selectedModelo = items.find((item) => item.co_seq_modelo === selectedFromUrl)

    if (!selectedModelo) {
      setSelectedId(selectedFromUrl)
      void loadDetail(selectedFromUrl)
      return
    }

    void loadDetail(selectedModelo.co_seq_modelo)
  }, [detailError, isDetailLoading, isListLoading, items, loadDetail, selectedFromUrl, selectedId, selectedItem])

  async function handleSelect(item: ModeloListItem) {
    setSearchParams({ modelo: String(item.co_seq_modelo) })
  }

  const contentClassName = useMemo(() => {
    return selectedId ? 'workspace with-detail' : 'workspace full-width'
  }, [selectedId])

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Modelos</span>
          <h1>Painel de consulta</h1>
        </div>

        <div className="topbar-actions">
          <button className="theme-toggle" onClick={onToggleTheme} type="button">
            {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              clearToken()
              navigate('/login', { replace: true })
            }}
            type="button"
          >
            Sair
          </button>
        </div>
      </header>

      <section className={contentClassName}>
        <div className="list-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">Lista simples</span>
              <h2>Modelos disponiveis</h2>
            </div>
            <span className="count-badge">{items.length} itens</span>
          </div>

          <ModelList
            error={listError}
            isLoading={isListLoading}
            items={items}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        </div>

        {selectedId ? (
          <ModelDetailPanel
            error={detailError}
            isLoading={isDetailLoading}
            item={selectedItem}
          />
        ) : null}
      </section>
    </main>
  )
}
