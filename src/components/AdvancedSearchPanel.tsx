import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Calendar, Star } from 'lucide-react';
import { useNotesStore } from '../store/useNotesStore';
import type { SearchOptions } from '../hooks/useAdvancedSearch';

interface AdvancedSearchPanelProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchOptions: SearchOptions;
    updateSearchOptions: (options: Partial<SearchOptions>) => void;
    clearSearch: () => void;
}

export const AdvancedSearchPanel = ({
    searchQuery,
    setSearchQuery,
    searchOptions,
    updateSearchOptions,
    clearSearch
}: AdvancedSearchPanelProps) => {
    const [showFilters, setShowFilters] = useState(false);
    const { getAllCategories } = useNotesStore();
    const categories = getAllCategories();

    return (
        <div className="px-4 py-2 sticky top-0 z-10 bg-ios-background-light dark:bg-ios-background-dark">
            <div className="relative mb-2">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Pesquisar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-10 py-2.5 text-sm focus:outline-none ios-input"
                />

                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-10 top-2.5 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <X size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                )}

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-3 top-2.5 p-1 rounded-full ${Object.values(searchOptions).some(val => val === true)
                            ? 'text-blue-500'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    <Filter size={16} />
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-3"
                    >
                        <h3 className="font-medium text-sm mb-3">Filtros de Pesquisa</h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={searchOptions.inTitle}
                                    onChange={(e) => updateSearchOptions({ inTitle: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">No título</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={searchOptions.inContent}
                                    onChange={(e) => updateSearchOptions({ inContent: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">No conteúdo</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={searchOptions.caseSensitive}
                                    onChange={(e) => updateSearchOptions({ caseSensitive: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">Diferenciar maiúsculas</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={searchOptions.matchWholeWord}
                                    onChange={(e) => updateSearchOptions({ matchWholeWord: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">Palavra inteira</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={searchOptions.onlyFavorites}
                                    onChange={(e) => updateSearchOptions({ onlyFavorites: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm flex items-center">
                                    Favoritas <Star size={14} className="ml-1 text-yellow-400" />
                                </span>
                            </label>
                        </div>

                        <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2">Categoria</h4>
                            <select
                                value={searchOptions.categoryId || ''}
                                onChange={(e) => updateSearchOptions({ categoryId: e.target.value || undefined })}
                                className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none ios-input"
                            >
                                <option value="">Todas as categorias</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="flex-1 min-w-[120px]">
                                <h4 className="text-sm font-medium mb-2 flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    Data inicial
                                </h4>
                                <input
                                    type="date"
                                    value={searchOptions.dateFrom ? new Date(searchOptions.dateFrom).toISOString().split('T')[0] : ''}
                                    onChange={(e) => {
                                        const date = e.target.value
                                            ? new Date(e.target.value)
                                            : undefined;
                                        updateSearchOptions({ dateFrom: date });
                                    }}
                                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none ios-input"
                                />
                            </div>

                            <div className="flex-1 min-w-[120px]">
                                <h4 className="text-sm font-medium mb-2 flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    Data final
                                </h4>
                                <input
                                    type="date"
                                    value={searchOptions.dateTo ? new Date(searchOptions.dateTo).toISOString().split('T')[0] : ''}
                                    onChange={(e) => {
                                        const date = e.target.value
                                            ? new Date(e.target.value)
                                            : undefined;
                                        updateSearchOptions({ dateTo: date });
                                    }}
                                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none ios-input"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
