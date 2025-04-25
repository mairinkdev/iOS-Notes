import { useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import NotesList from './components/NotesList'
import NoteEditor from './components/NoteEditor'
import { AnimatePresence } from 'framer-motion'

function App() {
  const { theme } = useTheme()
  const [editingNote, setEditingNote] = useState<string | null>(null)

  // Aplicar classe de tema ao elemento HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="h-screen w-full flex flex-col bg-ios-background-light dark:bg-ios-background-dark overflow-hidden">
      {/* Em telas maiores, limitar a largura máxima */}
      <div className="flex-1 w-full md:max-w-2xl md:mx-auto md:shadow-xl md:my-8 md:rounded-xl md:overflow-hidden">
        <AnimatePresence mode="wait">
          {editingNote !== null ? (
            <NoteEditor 
              key="editor"
              noteId={editingNote} 
              onClose={() => setEditingNote(null)} 
            />
          ) : (
            <NotesList 
              key="list"
              onNoteSelect={(id) => setEditingNote(id)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App 