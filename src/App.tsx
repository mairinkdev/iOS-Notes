import { useEffect, useState } from 'react'
import { useTheme } from './hooks/useTheme'
import NotesList from './components/NotesList'
import NoteEditor from './components/NoteEditor'
import { AnimatePresence, motion } from 'framer-motion'
import { useNotesStore } from './store/useNotesStore'

function App() {
  const { theme } = useTheme()
  const { notes } = useNotesStore()
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [showSplash, setShowSplash] = useState(true)
  const [appReady, setAppReady] = useState(false)

  // Aplicar classe de tema ao elemento HTML
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Simular tela de splash ao iniciar
  useEffect(() => {
    // Primeiro fase - mostrar splash screen
    const splashTimer = setTimeout(() => {
      setShowSplash(false)

      // Segunda fase - quando splash desaparece, marcar app como pronto
      const readyTimer = setTimeout(() => {
        setAppReady(true)
      }, 300)

      return () => clearTimeout(readyTimer)
    }, 1500)

    return () => clearTimeout(splashTimer)
  }, [])

  // Variantes de animação para componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="h-screen w-full flex flex-col bg-ios-background-light dark:bg-ios-background-dark overflow-hidden">
      {/* Em telas maiores, limitar a largura máxima */}
      <div className="flex-1 w-full md:max-w-2xl md:mx-auto md:shadow-xl md:my-8 md:rounded-xl md:overflow-hidden relative">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <motion.div
              key="splash"
              className="absolute inset-0 flex items-center justify-center bg-ios-background-light dark:bg-ios-background-dark z-50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-5 w-20 h-20 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.5V6.5C21 5.4 20.1 4.5 19 4.5H5C3.9 4.5 3 5.4 3 6.5V19.5C3 20.6 3.9 21.5 5 21.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 8.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M14.5 14.5L16.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M15.5 17.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18.5 20.5L20.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7.5 12.5H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          ) : editingNote !== null ? (
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

        {/* Mensagem para tela vazia */}
        {appReady && !showSplash && notes.length === 0 && !editingNote && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5 }}
            variants={containerVariants}
          >
            <motion.div
              className="rounded-full bg-gray-200 dark:bg-gray-700 p-3 mb-4"
              variants={itemVariants}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
              </svg>
            </motion.div>
            <motion.h3
              className="text-lg font-medium text-gray-500 mb-2"
              variants={itemVariants}
            >
              Crie sua primeira nota
            </motion.h3>
            <motion.p
              className="text-gray-400 text-sm max-w-xs"
              variants={itemVariants}
            >
              Toque no botão "Nova Nota" para começar a escrever suas anotações
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App
