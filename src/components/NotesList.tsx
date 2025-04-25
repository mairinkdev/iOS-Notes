import { useNotesStore } from '../store/useNotesStore'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'

interface NotesListProps {
  onNoteSelect: (id: string) => void
}

const NotesList = ({ onNoteSelect }: NotesListProps) => {
  const { notes, addNote } = useNotesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, toggleTheme } = useTheme()
  
  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(searchLower) || 
      note.content.toLowerCase().includes(searchLower)
    )
  })
  
  const handleCreateNote = () => {
    const newNoteId = addNote()
    onNoteSelect(newNoteId)
  }
  
  const formatPreviewText = (text: string) => {
    if (!text) return 'Nova nota...'
    return text.substring(0, 100)
  }
  
  // Função para formatar a data em português
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return format(date, "d 'de' MMMM", { locale: ptBR })
  }

  return (
    <motion.div 
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <header className="flex justify-between items-center px-4 pt-12 pb-2">
        <div>
          <button 
            onClick={toggleTheme}
            className="ios-button mr-3 touch-target"
          >
            {theme === 'dark' ? 'Claro' : 'Escuro'}
          </button>
          <span className="ios-header">Notas</span>
        </div>
        <button 
          onClick={handleCreateNote}
          className="ios-button flex items-center touch-target"
        >
          <Plus size={16} className="mr-1" />
          Nova Nota
        </button>
      </header>
      
      <div className="px-4 py-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-10 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4 md:container-notes">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ios-secondary-light">
            <p>Nenhuma nota encontrada</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <motion.div
              key={note.id}
              className="ios-note-card"
              onClick={() => onNoteSelect(note.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col">
                <h3 className="font-medium">
                  {note.title || 'Nova nota'}
                </h3>
                <div className="flex text-sm text-ios-secondary-light">
                  <span>{formatDate(note.updatedAt)}</span>
                  <span className="mx-1">•</span>
                  <span className="truncate">{formatPreviewText(note.content)}</span>
                </div>
              </div>
            </motion.div>
          ))
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