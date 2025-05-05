import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NoteFormat = {
  bold?: { start: number; end: number }[];
  italic?: { start: number; end: number }[];
  underline?: { start: number; end: number }[];
  checklist?: { position: number; checked: boolean }[];
}

export type NoteCategory = {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
  isFavorite: boolean;
  isLocked: boolean;
  lockPassword?: string;
  category?: string;
  bgColor?: string;
  formatting?: NoteFormat;
  attachments?: string[]; // URLs das imagens/anexos
}

interface NotesState {
  notes: Note[];
  categories: NoteCategory[];
  addNote: () => string;
  updateNote: (id: string, title: string, content: string) => void;
  updateNoteField: <K extends keyof Note>(id: string, field: K, value: Note[K]) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  toggleFavorite: (id: string) => void;
  toggleLock: (id: string, password?: string) => void;
  addCategory: (name: string, color: string) => string;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  exportNotes: () => string;
  importNotes: (data: string) => boolean;
  getAllCategories: () => NoteCategory[];
  getFavoriteNotes: () => Note[];
  searchNotes: (query: string) => Note[];
  duplicateNote: (id: string) => string;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      categories: [
        { id: 'default', name: 'Geral', color: '#3478F6' },
        { id: 'work', name: 'Trabalho', color: '#FF2D55' },
        { id: 'personal', name: 'Pessoal', color: '#5856D6' },
        { id: 'ideas', name: 'Ideias', color: '#FFCC00' },
      ],

      addNote: () => {
        const id = Date.now().toString();
        const timestamp = Date.now();

        set((state) => ({
          notes: [
            {
              id,
              title: '',
              content: '',
              updatedAt: timestamp,
              createdAt: timestamp,
              isFavorite: false,
              isLocked: false,
              category: 'default',
            },
            ...state.notes
          ]
        }));

        return id;
      },

      updateNote: (id, title, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, title, content, updatedAt: Date.now() }
              : note
          )
        }));
      },

      updateNoteField: (id, field, value) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, [field]: value, updatedAt: Date.now() }
              : note
          )
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id)
        }));
      },

      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id);
      },

      toggleFavorite: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() }
              : note
          )
        }));
      },

      toggleLock: (id, password) => {
        const note = get().getNoteById(id);
        if (!note) return;

        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  isLocked: !note.isLocked,
                  lockPassword: note.isLocked ? undefined : password,
                  updatedAt: Date.now()
                }
              : note
          )
        }));
      },

      addCategory: (name, color) => {
        const id = `cat_${Date.now()}`;

        set((state) => ({
          categories: [...state.categories, { id, name, color }]
        }));

        return id;
      },

      updateCategory: (id, name, color) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, name, color } : cat
          )
        }));
      },

      deleteCategory: (id) => {
        // Atualiza as notas dessa categoria para a categoria padrão
        set((state) => ({
          notes: state.notes.map((note) =>
            note.category === id
              ? { ...note, category: 'default' }
              : note
          ),
          categories: state.categories.filter((cat) => cat.id !== id)
        }));
      },

      exportNotes: () => {
        const { notes, categories } = get();
        return JSON.stringify({ notes, categories });
      },

      importNotes: (data) => {
        try {
          const importedData = JSON.parse(data);
          if (!importedData.notes || !Array.isArray(importedData.notes)) {
            return false;
          }

          set(() => ({
            notes: importedData.notes,
            categories: importedData.categories || get().categories
          }));

          return true;
        } catch (e) {
          console.error("Erro ao importar notas:", e);
          return false;
        }
      },

      getAllCategories: () => {
        return get().categories;
      },

      getFavoriteNotes: () => {
        return get().notes.filter(note => note.isFavorite);
      },

      searchNotes: (query) => {
        const searchLower = query.toLowerCase();
        return get().notes.filter(note =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
        );
      },

      duplicateNote: (id) => {
        const note = get().getNoteById(id);
        if (!note) return '';

        const newId = `dup_${Date.now()}`;
        const timestamp = Date.now();

        const duplicatedNote = {
          ...note,
          id: newId,
          title: `${note.title} (Cópia)`,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        set((state) => ({
          notes: [duplicatedNote, ...state.notes]
        }));

        return newId;
      }
    }),
    {
      name: 'notes-storage', // nome para o item no localStorage
    }
  )
)
