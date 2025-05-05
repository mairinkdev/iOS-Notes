import { useState } from 'react';
import { useNotesStore, NoteCategory } from '../store/useNotesStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';

interface CategorySelectorProps {
    selectedCategoryId: string | undefined;
    onSelectCategory: (categoryId: string) => void;
}

export const CategorySelector = ({ selectedCategoryId, onSelectCategory }: CategorySelectorProps) => {
    const { getAllCategories, addCategory, updateCategory, deleteCategory } = useNotesStore();
    const [isOpen, setIsOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#3478F6');
    const [editingCategory, setEditingCategory] = useState<NoteCategory | null>(null);

    const categories = getAllCategories();
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId) || categories[0];

    const predefinedColors = [
        '#3478F6', // Azul
        '#FF2D55', // Rosa
        '#5856D6', // Roxo
        '#FFCC00', // Amarelo
        '#FF9500', // Laranja
        '#4CD964', // Verde
        '#8E8E93', // Cinza
    ];

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            if (editingCategory) {
                updateCategory(editingCategory.id, newCategoryName, newCategoryColor);
            } else {
                const newCategoryId = addCategory(newCategoryName, newCategoryColor);
                onSelectCategory(newCategoryId);
            }
            setNewCategoryName('');
            setNewCategoryColor('#3478F6');
            setShowAddForm(false);
            setEditingCategory(null);
        }
    };

    const handleEditCategory = (category: NoteCategory) => {
        setNewCategoryName(category.name);
        setNewCategoryColor(category.color);
        setEditingCategory(category);
        setShowAddForm(true);
    };

    const handleDeleteCategory = (categoryId: string) => {
        if (categories.length <= 1) return; // Impede excluir se for a única categoria
        deleteCategory(categoryId);
        if (selectedCategoryId === categoryId) {
            onSelectCategory(categories[0].id);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-sm"
                style={{
                    borderLeft: `4px solid ${selectedCategory.color}`
                }}
            >
                <span>{selectedCategory.name}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 left-0 top-full mt-1 bg-ios-note-light dark:bg-ios-note-dark rounded-xl shadow-lg p-2 w-64"
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1 cursor-pointer"
                                    onClick={() => {
                                        onSelectCategory(category.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        ></div>
                                        <span>{category.name}</span>
                                    </div>

                                    <div className="flex items-center">
                                        {selectedCategoryId === category.id && (
                                            <Check size={16} className="text-blue-500" />
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditCategory(category);
                                            }}
                                            className="p-1 ml-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                            </svg>
                                        </button>

                                        {category.id !== 'default' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(category.id);
                                                }}
                                                className="p-1 ml-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-red-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showAddForm ? (
                            <div className="p-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nome da categoria"
                                    className="w-full p-2 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                    autoFocus
                                />

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {predefinedColors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewCategoryColor(color)}
                                            className="w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: color }}
                                        >
                                            {color === newCategoryColor && (
                                                <Check size={14} className="text-white" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingCategory(null);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddCategory}
                                        className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm"
                                    >
                                        {editingCategory ? 'Atualizar' : 'Adicionar'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center justify-center gap-1 w-full p-2 mt-2 border-t border-gray-200 dark:border-gray-700 text-blue-500"
                            >
                                <Plus size={16} />
                                <span>Nova Categoria</span>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
