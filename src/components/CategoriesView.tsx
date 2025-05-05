import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotesStore, NoteCategory } from '../store/useNotesStore';
import { ChevronRight } from 'lucide-react';

interface CategoriesViewProps {
    onNoteSelect: (id: string) => void;
}

export const CategoriesView = ({ onNoteSelect }: CategoriesViewProps) => {
    const { getAllCategories, notes } = useNotesStore();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const categories = getAllCategories();

    // Agrupa as notas por categoria
    const notesByCategory = categories.reduce((acc, category) => {
        acc[category.id] = notes.filter(note => note.category === category.id);
        return acc;
    }, {} as Record<string, typeof notes>);

    // Renderiza uma categoria e suas notas
    const renderCategory = (category: NoteCategory) => {
        const categoryNotes = notesByCategory[category.id] || [];
        const isExpanded = expandedCategory === category.id;

        if (categoryNotes.length === 0) return null;

        return (
            <div key={category.id} className="mb-4">
                <button
                    className="flex items-center justify-between w-full p-2 text-left"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                >
                    <div className="flex items-center">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                        ></div>
                        <h3 className="font-medium">{category.name}</h3>
                        <span className="text-xs text-ios-secondary-light ml-2">
                            ({categoryNotes.length})
                        </span>
                    </div>

                    <ChevronRight
                        size={16}
                        className={`text-ios-secondary-light transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                </button>

                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-5"
                    >
                        {categoryNotes.map(note => (
                            <motion.div
                                key={note.id}
                                className="pl-2 pr-4 py-2 border-l-2 my-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
                                style={{ borderLeftColor: category.color }}
                                onClick={() => onNoteSelect(note.id)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <h4 className="font-medium text-sm">
                                    {note.title || 'Sem título'}
                                </h4>
                                <p className="text-xs text-ios-secondary-light truncate">
                                    {note.content || 'Nota vazia...'}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        );
    };

    return (
        <div className="px-4 py-2">
            <h2 className="text-lg font-semibold mb-4">Categorias</h2>

            {categories.map(renderCategory)}

            {categories.every(cat => !notesByCategory[cat.id] || notesByCategory[cat.id].length === 0) && (
                <div className="text-center py-8 text-ios-secondary-light">
                    <p>Nenhuma nota encontrada nas categorias</p>
                </div>
            )}
        </div>
    );
};
