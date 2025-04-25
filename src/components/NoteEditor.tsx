import { useState, useEffect, useRef } from 'react'
import { useNotesStore, Note } from '../store/useNotesStore'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, MoreVertical, Trash2 } from 'lucide-react'

interface NoteEditorProps {
  noteId: string
  onClose: () => void
}

const NoteEditor = ({ noteId, onClose }: NoteEditorProps) => {
  const { getNoteById, updateNote, deleteNote } = useNotesStore()
  const [note, setNote] = useState<Note | undefined>(getNoteById(noteId))
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Atualiza o título e conteúdo quando a nota muda
  useEffect(() => {
    const note = getNoteById(noteId)
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    }
  }, [noteId, getNoteById])

  // Auto-ajusta a altura do textarea
  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = `${element.scrollHeight}px`
  }

  // Efeito para auto-ajustar altura dos textareas
  useEffect(() => {
    if (titleRef.current) autoResize(titleRef.current)
    if (contentRef.current) autoResize(contentRef.current)
  }, [title, content])

  // Salva alterações automaticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      if (noteId) {
        updateNote(noteId, title, content)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [title, content, noteId, updateNote])

  // Formata a data em português
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
  }

  const handleDeleteNote = () => {
    deleteNote(noteId)
    onClose()
  }

  if (!note) return null

  return (
    <motion.div 
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <header className="flex justify-between items-center px-4 pt-12 pb-2 sticky top-0 bg-ios-background-light dark:bg-ios-background-dark z-10">
        <button 
          onClick={onClose}
          className="ios-button flex items-center touch-target"
        >
          <ChevronLeft size={16} className="mr-1" />
          Notas
        </button>
        
        <div className="flex items-center">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-500 touch-target"
          >
            <Trash2 size={20} />
          </button>
          
          <button className="p-2 text-blue-500 touch-target">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>
      
      <div className="px-4 text-xs text-center text-ios-secondary-light">
        Editado {formatDate(note.updatedAt)}
      </div>
      
      <div className="flex-1 flex flex-col p-4 overflow-y-auto md:container-notes">
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onInput={(e) => autoResize(e.currentTarget)}
          placeholder="Título"
          className="w-full resize-none overflow-hidden text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 mb-2"
          rows={1}
        />
        
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => autoResize(e.currentTarget)}
          placeholder="Nota..."
          className="w-full flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-base"
          autoFocus
        />
      </div>
      
      {/* Modal de confirmação para excluir */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-ios-note-light dark:bg-ios-note-dark rounded-xl w-full max-w-xs overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg mb-2">Apagar Nota</h3>
              <p className="text-ios-secondary-light mb-4">
                Tem certeza que deseja apagar esta nota?
              </p>
              
              <div className="flex border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 p-3 text-blue-500 font-medium border-r border-gray-200 dark:border-gray-700"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDeleteNote}
                  className="flex-1 p-3 text-red-500 font-medium"
                >
                  Apagar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default NoteEditor 