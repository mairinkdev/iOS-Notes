import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';

const NOTE_COLORS = [
    { name: 'Padrão', value: '' },
    { name: 'Branco', value: '#FFFFFF' },
    { name: 'Amarelo Claro', value: '#FFF9C4' },
    { name: 'Verde Claro', value: '#F1F8E9' },
    { name: 'Azul Claro', value: '#E1F5FE' },
    { name: 'Rosa Claro', value: '#FCE4EC' },
    { name: 'Laranja Claro', value: '#FFF3E0' },
    { name: 'Roxo Claro', value: '#F3E5F5' },
];

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSelectColor = (colorValue: string) => {
        onChange(colorValue);
        setIsOpen(false);
    };

    const selectedColor = value || '';

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Alterar cor de fundo"
            >
                <Palette size={16} className="text-ios-secondary-light" />
                <div
                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: selectedColor || 'transparent' }}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 bottom-full mb-1 p-2 bg-ios-note-light dark:bg-ios-note-dark rounded-lg shadow-lg z-10 min-w-[200px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div className="grid grid-cols-4 gap-2">
                            {NOTE_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleSelectColor(color.value)}
                                    className="flex flex-col items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <div
                                        className="w-6 h-6 rounded-full mb-1 border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                                        style={{ backgroundColor: color.value || 'transparent' }}
                                    >
                                        {selectedColor === color.value && <Check size={14} />}
                                    </div>
                                    <span className="text-xs">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
