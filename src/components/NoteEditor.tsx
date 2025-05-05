import { useState, useEffect, useRef } from 'react'
import { useNotesStore, Note } from '../store/useNotesStore'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, MoreVertical, Trash2, Lock, Star, Copy, Share } from 'lucide-react'
import { CategorySelector } from './CategorySelector'
import { TextFormatToolbar } from './TextFormatToolbar'
import { useTextFormatting } from '../hooks/useTextFormatting'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import { ColorPicker } from './ColorPicker'

interface NoteEditorProps {
  noteId: string
  onClose: () => void
}

const NoteEditor = ({ noteId, onClose }: NoteEditorProps) => {
  const { getNoteById, updateNote, updateNoteField, deleteNote, toggleFavorite, toggleLock, duplicateNote } = useNotesStore()
  const [note] = useState<Note | undefined>(getNoteById(noteId))
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showLockDialog, setShowLockDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [unlockPassword, setUnlockPassword] = useState('')
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | undefined>(note?.updatedAt)

  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const {
    formatting,
    applyFormat,
    addChecklistItem,
    renderFormattedText
  } = useTextFormatting(note?.formatting)

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
        setSaving(true)
        updateNote(noteId, title, content)
        setTimeout(() => {
          setSaving(false)
          setLastSaved(Date.now())
        }, 500) // Simula um pequeno atraso no salvamento
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [title, content, noteId, updateNote])

  // Salva a formatação quando mudar
  useEffect(() => {
    if (noteId && formatting) {
      updateNoteField(noteId, 'formatting', formatting)
    }
  }, [formatting, noteId, updateNoteField])

  // Formata a data em português
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
  }

  const handleDeleteNote = () => {
    deleteNote(noteId)
    onClose()
  }

  const handleSelectCategory = (categoryId: string) => {
    updateNoteField(noteId, 'category', categoryId)
  }

  const handleToggleLock = () => {
    if (note?.isLocked) {
      // Desbloquear
      toggleLock(noteId)
      setShowLockDialog(false)
    } else {
      // Bloquear - mostrar diálogo de senha
      setShowLockDialog(true)
      setTimeout(() => {
        passwordRef.current?.focus()
      }, 100)
    }
  }

  const handleLockConfirm = () => {
    if (!password) {
      setPasswordError('Por favor, insira uma senha')
      return
    }

    if (password !== passwordConfirm) {
      setPasswordError('As senhas não correspondem')
      return
    }

    toggleLock(noteId, password)
    setShowLockDialog(false)
    setPassword('')
    setPasswordConfirm('')
    setPasswordError('')
  }

  const handleUnlock = () => {
    // Verificar se a senha está correta
    if (unlockPassword === note?.lockPassword) {
      toggleLock(noteId)
      setUnlockPassword('')
    } else {
      setPasswordError('Senha incorreta')
    }
  }

  const handleDuplicateNote = () => {
    const duplicatedNoteId = duplicateNote(noteId)
    setShowOptionsMenu(false)

    // Opcional: navegue para a nota duplicada
    if (duplicatedNoteId) {
      onClose() // Feche a atual
      // Aguarde um momento antes de abrir a nova nota
      setTimeout(() => {
        // Aqui você precisaria de uma maneira de navegar para a nota duplicada
        // Por exemplo, poderia passar uma função para o editor via props
      }, 100)
    }
  }

  const handleShareNote = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'Nota sem título',
        text: content,
      })
        .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      // Fallback - copia para a área de transferência
      navigator.clipboard.writeText(`${title}\n\n${content}`)
        .then(() => alert('Nota copiada para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar: ', err));
    }
    setShowOptionsMenu(false);
  }

  const handleColorChange = (color: string) => {
    updateNoteField(noteId, 'bgColor', color);
  }

  const handleAddImage = (file: File) => {
    // Aqui você pode implementar o upload da imagem para um serviço
    // e adicionar a URL à nota
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      // Para este exemplo, vamos apenas adicionar o base64 no conteúdo
      // Em uma implementação real, você poderia fazer upload para algum serviço
      // Como placeholder, apenas coloca a imagem no texto
      setContent(prev => prev + `\n[Imagem inserida]\n`)

      // No futuro, poderia salvar em attachments
      const attachments = note?.attachments || []
      updateNoteField(noteId, 'attachments', [...attachments, base64])
    }
    reader.readAsDataURL(file)
  }

  const handleTextSelection = () => {
    if (contentRef.current) {
      const start = contentRef.current.selectionStart
      const end = contentRef.current.selectionEnd

      if (start !== end) {
        setSelectionRange({ start, end })
      }
    }
  }

  if (!note) return null

  // Se a nota estiver bloqueada e não foi desbloqueada, mostrar tela de desbloqueio
  if (note.isLocked && !showLockDialog) {
    return (
      <motion.div
        className="flex flex-col h-full w-full items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-ios-note-light dark:bg-ios-note-dark rounded-xl p-6 w-full max-w-md shadow-md">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onClose}
              className="ios-button touch-target"
            >
              <ChevronLeft size={16} className="mr-1" />
              Voltar
            </button>
            <h2 className="text-lg font-medium">Nota Bloqueada</h2>
          </div>

          <div className="flex flex-col items-center mb-6">
            <Lock size={48} className="text-gray-400 mb-4" />
            <p className="text-center mb-4">Esta nota está protegida por senha.</p>

            <input
              type="password"
              placeholder="Digite a senha"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />

            {passwordError && (
              <p className="text-red-500 text-sm mb-3">{passwordError}</p>
            )}

            <button
              onClick={handleUnlock}
              className="w-full p-3 bg-blue-500 text-white rounded-lg"
            >
              Desbloquear
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex flex-col h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: note.bgColor || undefined
      }}
    >
      <header className="flex justify-between items-center px-4 pt-12 pb-2 sticky top-0 bg-opacity-95 z-10"
        style={{
          backgroundColor: note.bgColor || 'var(--ios-background-light)',
        }}
      >
        <button
          onClick={onClose}
          className="ios-button flex items-center touch-target"
        >
          <ChevronLeft size={16} className="mr-1" />
          Notas
        </button>

        <div className="flex items-center">
          <button
            onClick={() => toggleFavorite(noteId)}
            className="p-2 touch-target"
          >
            <Star
              size={20}
              className={note.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
            />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-500 touch-target"
          >
            <Trash2 size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 text-blue-500 touch-target"
            >
              <MoreVertical size={20} />
            </button>

            <AnimatePresence>
              {showOptionsMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-1 bg-ios-note-light dark:bg-ios-note-dark rounded-xl shadow-lg p-2 w-48 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={handleToggleLock}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Lock size={16} />
                    <span>{note.isLocked ? "Desbloquear" : "Bloquear"}</span>
                  </button>

                  <button
                    onClick={handleDuplicateNote}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Copy size={16} />
                    <span>Duplicar</span>
                  </button>

                  <button
                    onClick={handleShareNote}
                    className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Share size={16} />
                    <span>Compartilhar</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between px-4 text-xs text-ios-secondary-light">
        <AutoSaveIndicator saving={saving} lastSaved={lastSaved} />

        <div className="flex items-center gap-2">
          <ColorPicker
            value={note.bgColor || ''}
            onChange={handleColorChange}
          />

          <CategorySelector
            selectedCategoryId={note.category}
            onSelectCategory={handleSelectCategory}
          />
        </div>
      </div>

      <div
        className="flex-1 flex flex-col p-4 overflow-y-auto md:container-notes"
      >
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
          onSelect={handleTextSelection}
          placeholder="Nota..."
          className="w-full flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-base"
          autoFocus
        />
      </div>

      {/* Barra de formatação */}
      <TextFormatToolbar
        onFormat={applyFormat}
        onAddChecklist={addChecklistItem}
        onChangeBackgroundColor={handleColorChange}
        onAddImage={handleAddImage}
        selectionRange={selectionRange}
      />

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

      {/* Modal para bloquear com senha */}
      {showLockDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-ios-note-light dark:bg-ios-note-dark rounded-xl w-full max-w-xs overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4 text-center">
                {note.isLocked ? "Desbloquear Nota" : "Proteger com Senha"}
              </h3>

              <div className="mb-4">
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                />

                {!note.isLocked && (
                  <input
                    type="password"
                    placeholder="Confirme a senha"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full p-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  />
                )}

                {passwordError && (
                  <p className="text-red-500 text-sm mb-2">{passwordError}</p>
                )}

                <p className="text-xs text-ios-secondary-light mb-4">
                  {note.isLocked
                    ? "Digite a senha para desbloquear esta nota."
                    : "A nota será bloqueada e só poderá ser acessada com esta senha."
                  }
                </p>
              </div>

              <div className="flex border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowLockDialog(false)
                    setPassword('')
                    setPasswordConfirm('')
                    setPasswordError('')
                  }}
                  className="flex-1 p-3 text-blue-500 font-medium border-r border-gray-200 dark:border-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLockConfirm}
                  className="flex-1 p-3 text-blue-500 font-medium"
                >
                  {note.isLocked ? "Desbloquear" : "Bloquear"}
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
