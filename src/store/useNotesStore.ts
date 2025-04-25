import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
  createdAt: number
}

interface NotesState {
  notes: Note[]
  addNote: () => string
  updateNote: (id: string, title: string, content: string) => void
  deleteNote: (id: string) => void
  getNoteById: (id: string) => Note | undefined
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      
      addNote: () => {
        const id = Date.now().toString()
        const timestamp = Date.now()
        
        set((state) => ({
          notes: [
            {
              id,
              title: '',
              content: '',
              updatedAt: timestamp,
              createdAt: timestamp
            },
            ...state.notes
          ]
        }))
        
        return id
      },
      
      updateNote: (id, title, content) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { ...note, title, content, updatedAt: Date.now() } 
              : note
          )
        }))
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id)
        }))
      },
      
      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id)
      }
    }),
    {
      name: 'notes-storage', // nome para o item no localStorage
    }
  )
) 