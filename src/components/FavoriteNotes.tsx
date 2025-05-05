import { motion } from 'framer-motion';
import { useNotesStore } from '../store/useNotesStore';
import { Star } from 'lucide-react';

interface FavoriteNotesProps {
    onNoteSelect: (id: string) => void;
}

export const FavoriteNotes = ({ onNoteSelect }: FavoriteNotesProps) => {
    const { getFavoriteNotes, getAllCategories } = useNotesStore();
    const favoriteNotes = getFavoriteNotes();
    const categories = getAllCategories();

    // Se não houver notas favoritas, não renderiza o componente
    if (favoriteNotes.length === 0) {
        return null;
    }

    const getCategoryColor = (categoryId: string | undefined) => {
        if (!categoryId) return '#3478F6'; // cor padrão
        const category = categories.find(cat => cat.id === categoryId);
        return category?.color || '#3478F6';
    };

    // Formata o conteúdo para exibição (corta se for muito longo)
    const formatContent = (content: string) => {
        if (!content) return 'Nota sem conteúdo';
        return content.length > 60 ? content.substring(0, 60) + '...' : content;
    };

    return (
        <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center mb-2 px-4">
                <Star size={16} className="text-yellow-400 mr-2" />
                <h2 className="text-sm font-medium">Favoritas</h2>
            </div>

            <div className="flex overflow-x-auto pb-2 px-4 gap-3 hide-scrollbar">
                {favoriteNotes.map(note => {
                    const categoryColor = getCategoryColor(note.category);

                    return (
                        <motion.div
                            key={note.id}
                            className="flex-shrink-0 w-48 h-32 rounded-xl p-3 shadow-sm cursor-pointer bg-ios-note-light dark:bg-ios-note-dark"
                            style={{
                                borderLeft: `4px solid ${categoryColor}`,
                                backgroundColor: note.bgColor || undefined
                            }}
                            onClick={() => onNoteSelect(note.id)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <h3 className="font-medium text-sm mb-1 line-clamp-1">
                                {note.title || 'Sem título'}
                            </h3>

                            <p className="text-xs text-ios-secondary-light line-clamp-4">
                                {formatContent(note.content)}
                            </p>

                            {/* Indicador de categoria */}
                            {note.category && (
                                <div className="mt-auto pt-1 flex items-center">
                                    <div
                                        className="w-2 h-2 rounded-full mr-1"
                                        style={{ backgroundColor: categoryColor }}
                                    ></div>
                                    <span className="text-xs text-ios-secondary-light">
                                        {categories.find(cat => cat.id === note.category)?.name}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};
