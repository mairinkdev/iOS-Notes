import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, PieChart, Clock } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';

interface NotesStatisticsProps {
    onClose: () => void;
}

export const NotesStatistics = ({ onClose }: NotesStatisticsProps) => {
    const { notes, getAllCategories } = useNotesStore();
    const [activeTab, setActiveTab] = useState<'general' | 'categories' | 'activity'>('general');

    const categories = getAllCategories();

    // Estatísticas gerais
    const totalNotes = notes.length;
    const favoritedNotes = notes.filter(note => note.isFavorite).length;
    const lockedNotes = notes.filter(note => note.isLocked).length;
    const emptyNotes = notes.filter(note => !note.title && !note.content).length;

    // Tamanho médio das notas
    const averageContentLength = notes.length > 0
        ? Math.round(notes.reduce((sum, note) => sum + note.content.length, 0) / notes.length)
        : 0;

    // Tamanho médio dos títulos
    const averageTitleLength = notes.length > 0
        ? Math.round(notes.reduce((sum, note) => sum + (note.title?.length || 0), 0) / notes.length)
        : 0;

    // Estatísticas por categoria
    const notesByCategory = categories.map(category => {
        const count = notes.filter(note => note.category === category.id).length;
        return {
            ...category,
            count,
            percentage: totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0
        };
    });

    // Estatísticas de atividade
    const now = new Date();
    const todayNotes = notes.filter(note => {
        const noteDate = new Date(note.updatedAt);
        return noteDate.toDateString() === now.toDateString();
    }).length;

    const yesterdayNotes = notes.filter(note => {
        const noteDate = new Date(note.updatedAt);
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return noteDate.toDateString() === yesterday.toDateString();
    }).length;

    const lastWeekNotes = notes.filter(note => {
        const noteDate = new Date(note.updatedAt);
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return noteDate >= weekAgo;
    }).length;

    const lastMonthNotes = notes.filter(note => {
        const noteDate = new Date(note.updatedAt);
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return noteDate >= monthAgo;
    }).length;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-ios-note-light dark:bg-ios-note-dark rounded-xl w-full max-w-md overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Estatísticas das Notas</h2>
                        <button
                            onClick={onClose}
                            className="text-ios-secondary-light hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex-1 py-2 text-center ${activeTab === 'general'
                                    ? 'text-blue-500 border-b-2 border-blue-500'
                                    : 'text-ios-secondary-light'
                                }`}
                        >
                            <BarChart size={16} className="inline mr-1" />
                            <span>Geral</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`flex-1 py-2 text-center ${activeTab === 'categories'
                                    ? 'text-blue-500 border-b-2 border-blue-500'
                                    : 'text-ios-secondary-light'
                                }`}
                        >
                            <PieChart size={16} className="inline mr-1" />
                            <span>Categorias</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`flex-1 py-2 text-center ${activeTab === 'activity'
                                    ? 'text-blue-500 border-b-2 border-blue-500'
                                    : 'text-ios-secondary-light'
                                }`}
                        >
                            <Clock size={16} className="inline mr-1" />
                            <span>Atividade</span>
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'general' && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold">{totalNotes}</div>
                                        <div className="text-xs text-ios-secondary-light">Total de Notas</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold">{favoritedNotes}</div>
                                        <div className="text-xs text-ios-secondary-light">Notas Favoritas</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold">{lockedNotes}</div>
                                        <div className="text-xs text-ios-secondary-light">Notas Bloqueadas</div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold">{emptyNotes}</div>
                                        <div className="text-xs text-ios-secondary-light">Notas Vazias</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Tamanho Médio</h3>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-lg font-semibold">{averageTitleLength}</div>
                                                <div className="text-xs text-ios-secondary-light">Caracteres por Título</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-lg font-semibold">{averageContentLength}</div>
                                                <div className="text-xs text-ios-secondary-light">Caracteres por Nota</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'categories' && (
                            <motion.div
                                key="categories"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {notesByCategory.length === 0 ? (
                                    <div className="text-center p-4 text-ios-secondary-light">
                                        Nenhuma categoria encontrada
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {notesByCategory
                                            .sort((a, b) => b.count - a.count)
                                            .map((category) => (
                                                <div key={category.id} className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: category.color }}
                                                    ></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <span>{category.name}</span>
                                                            <span className="text-ios-secondary-light">{category.count}</span>
                                                        </div>
                                                        <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${category.percentage}%`,
                                                                    backgroundColor: category.color,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'activity' && (
                            <motion.div
                                key="activity"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span>Hoje</span>
                                            <span className="text-blue-500 font-semibold">{todayNotes}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span>Ontem</span>
                                            <span className="text-blue-500 font-semibold">{yesterdayNotes}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span>Últimos 7 dias</span>
                                            <span className="text-blue-500 font-semibold">{lastWeekNotes}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span>Último mês</span>
                                            <span className="text-blue-500 font-semibold">{lastMonthNotes}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Fechar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
