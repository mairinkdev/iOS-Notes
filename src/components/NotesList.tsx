import { useNotesStore } from '../store/useNotesStore'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Search, Star, ChevronDown, Settings, Download, Upload, ExternalLink, Moon, Sun, BarChart } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { FavoriteNotes } from './FavoriteNotes'
import { CategorySelector } from './CategorySelector'
import { useAdvancedSearch } from '../hooks/useAdvancedSearch'
import { AdvancedSearchPanel } from './AdvancedSearchPanel'
import { CategoriesView } from './CategoriesView'
import { SyncStatusIndicator } from './SyncStatusIndicator'
import { NotesStatistics } from './NotesStatistics'

interface NotesListProps {
  onNoteSelect: (id: string) => void
}

const NotesList = ({ onNoteSelect }: NotesListProps) => {
  const { notes, addNote, updateNoteField, toggleFavorite, exportNotes, importNotes, getAllCategories } = useNotesStore()
  const [showSettings, setShowSettings] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('default')
  const [viewMode, setViewMode] = useState<'list' | 'categories'>('list')
  const { theme, toggleTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showStats, setShowStats] = useState(false)

  // Usar a pesquisa avançada
  const {
    searchQuery,
    setSearchQuery,
    searchOptions,
    updateSearchOptions,
    searchResults,
    clearSearch,
    highlightMatch
  } = useAdvancedSearch()

  // Filtrar as notas com base no modo de visualização e categoria
  const filteredNotes = viewMode === 'list' ? searchResults : []

  // Se uma categoria estiver selecionada e não estiver usando a pesquisa avançada com filtro de categoria
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all' && !searchOptions.categoryId) {
      updateSearchOptions({ categoryId: selectedCategory })
    }
  }, [selectedCategory, updateSearchOptions, searchOptions.categoryId])

  const handleCreateNote = () => {
    const newNoteId = addNote()
    if (selectedCategory && selectedCategory !== 'all') {
      updateNoteField(newNoteId, 'category', selectedCategory)
    }
    onNoteSelect(newNoteId)
  }

  const formatPreviewText = (text: string) => {
    if (!text) return 'Nova nota...'
    return text.substring(0, 100)
  }

  // Função para formatar a data em português
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()

    // Se for hoje, exibe a hora
    if (date.toDateString() === now.toDateString()) {
      return format(date, "'Hoje,' HH:mm", { locale: ptBR })
    }

    // Se for ontem, exibe "Ontem"
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return format(date, "'Ontem,' HH:mm", { locale: ptBR })
    }

    // Para datas mais antigas, exibe a data completa
    return format(date, "d 'de' MMMM", { locale: ptBR })
  }

  // Função para exportar notas
  const handleExportNotes = () => {
    const notesData = exportNotes()
    const blob = new Blob([notesData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notas_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowSettings(false)
  }

  // Função para importar notas
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const success = importNotes(content)
        if (success) {
          alert('Notas importadas com sucesso!')
        } else {
          alert('Erro ao importar notas. Formato inválido.')
        }
      }
    }
    reader.readAsText(file)
    setShowSettings(false)
  }

  // Obter cores das categorias
  const getCategoryColor = (categoryId: string | undefined) => {
    if (!categoryId) return '#3478F6'
    const category = getAllCategories().find(cat => cat.id === categoryId)
    return category?.color || '#3478F6'
  }

  return (
    <motion.div
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <header className="px-4 pt-12 pb-2 sticky top-0 bg-ios-background-light dark:bg-ios-background-dark z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="ios-button mr-3 touch-target"
            >
              <Settings size={16} className="mr-1" />
            </button>
            <span className="ios-header">Notas</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'categories' : 'list')}
              className="ios-button touch-target"
            >
              {viewMode === 'list' ? 'Categorias' : 'Lista'}
            </button>
            <button
              onClick={handleCreateNote}
              className="ios-button flex items-center touch-target"
            >
              <Plus size={16} className="mr-1" />
              Nova Nota
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <AdvancedSearchPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchOptions={searchOptions}
            updateSearchOptions={updateSearchOptions}
            clearSearch={clearSearch}
          />
        )}
      </header>

      {/* Menu de configurações */}
      {showSettings && (
        <motion.div
          className="absolute top-24 left-4 z-50 bg-ios-note-light dark:bg-ios-note-dark rounded-xl shadow-lg p-2 w-64"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={18} />
                  <span>Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span>Tema Escuro</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setShowStats(true);
                setShowSettings(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <BarChart size={18} />
              <span>Estatísticas</span>
            </button>

            <button
              onClick={handleExportNotes}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download size={18} />
              <span>Exportar Notas</span>
            </button>

            <button
              onClick={handleImportClick}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Upload size={18} />
              <span>Importar Notas</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json"
                className="hidden"
              />
            </button>

            <a
              href="https://github.com/mairinkdev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ExternalLink size={18} />
              <span>Sobre o Desenvolvedor</span>
            </a>
          </div>
        </motion.div>
      )}

      {/* Estatísticas */}
      <AnimatePresence>
        {showStats && (
          <NotesStatistics onClose={() => setShowStats(false)} />
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto md:container-notes">
        {viewMode === 'list' ? (
          <>
            {/* Status de Sincronização */}
            <div className="px-4 mt-2 mb-1 flex justify-end">
              <SyncStatusIndicator />
            </div>

            {/* Seção de notas favoritas */}
            <FavoriteNotes onNoteSelect={onNoteSelect} />

            {/* Lista principal de notas */}
            <div className="px-4 pb-4">
              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-ios-secondary-light">
                  <p>Nenhuma nota encontrada</p>
                </div>
              ) : (
                <>
                  {selectedCategory === 'all' && (
                    <div className="flex items-center mb-2">
                      <ChevronDown size={16} className="text-ios-secondary-light mr-2" />
                      <h2 className="text-sm font-medium text-ios-secondary-light">Todas as Notas</h2>
                    </div>
                  )}

                  {filteredNotes.map(note => {
                    const categoryColor = getCategoryColor(note.category)

                    return (
                      <motion.div
                        key={note.id}
                        className="ios-note-card flex justify-between group"
                        onClick={() => onNoteSelect(note.id)}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          borderLeft: `4px solid ${categoryColor}`,
                          backgroundColor: note.bgColor || undefined
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">
                              {searchQuery && searchOptions.inTitle
                                ? highlightMatch(note.title || 'Nova nota', searchQuery)
                                : note.title || 'Nova nota'
                              }
                            </h3>
                            {note.isLocked && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3.5 h-3.5 ml-1.5 text-ios-secondary-light"
                              >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            )}
                          </div>
                          <div className="flex text-sm text-ios-secondary-light">
                            <span>{formatDate(note.updatedAt)}</span>
                            <span className="mx-1">•</span>
                            <span className="truncate">
                              {searchQuery && searchOptions.inContent
                                ? highlightMatch(formatPreviewText(note.content), searchQuery)
                                : formatPreviewText(note.content)
                              }
                            </span>
                          </div>
                        </div>

                        <button
                          className="opacity-0 group-hover:opacity-100 p-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(note.id)
                          }}
                        >
                          <Star
                            size={16}
                            className={note.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                          />
                        </button>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>
          </>
        ) : (
          // Visualização por Categorias
          <CategoriesView onNoteSelect={onNoteSelect} />
        )}
      </div>

      <div className="p-4 text-center text-xs text-ios-secondary-light">
        {notes.length} {notes.length === 1 ? 'Nota' : 'Notas'}
      </div>

      <div className="p-2 text-center text-xs text-ios-secondary-light border-t border-gray-200 dark:border-gray-700">
        <a
          href="https://github.com/mairinkdev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Desenvolvido por: @mairinkdev
        </a>
      </div>
    </motion.div>
  )
}

export default NotesList
