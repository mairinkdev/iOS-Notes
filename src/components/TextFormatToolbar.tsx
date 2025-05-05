import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, List, Palette, Image } from 'lucide-react';
import { NoteFormat } from '../store/useNotesStore';

interface TextFormatToolbarProps {
    onFormat: (type: 'bold' | 'italic' | 'underline', start: number, end: number) => void;
    onAddChecklist: (position: number) => void;
    onChangeBackgroundColor: (color: string) => void;
    onAddImage: (file: File) => void;
    selectionRange: { start: number; end: number } | null;
}

export const TextFormatToolbar = ({
    onFormat,
    onAddChecklist,
    onChangeBackgroundColor,
    onAddImage,
    selectionRange
}: TextFormatToolbarProps) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const predefinedColors = [
        '#FFFFFF', // Branco (Padrão)
        '#F2F2F2', // Cinza claro
        '#FFF9C4', // Amarelo claro
        '#E1F5FE', // Azul claro
        '#F1F8E9', // Verde claro
        '#FFF3E0', // Laranja claro
        '#FCE4EC', // Rosa claro
    ];

    const handleFormatClick = (type: 'bold' | 'italic' | 'underline') => {
        if (selectionRange) {
            onFormat(type, selectionRange.start, selectionRange.end);
        }
    };

    const handleChecklistClick = () => {
        if (selectionRange) {
            onAddChecklist(selectionRange.start);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onAddImage(files[0]);
        }
    };

    return (
        <motion.div
            className="flex items-center justify-around p-2 bg-ios-note-light dark:bg-ios-note-dark rounded-t-lg shadow-sm border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <button
                onClick={() => handleFormatClick('bold')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!selectionRange || selectionRange.start === selectionRange.end}
            >
                <Bold size={18} className={!selectionRange || selectionRange.start === selectionRange.end ? "text-gray-400" : ""} />
            </button>

            <button
                onClick={() => handleFormatClick('italic')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!selectionRange || selectionRange.start === selectionRange.end}
            >
                <Italic size={18} className={!selectionRange || selectionRange.start === selectionRange.end ? "text-gray-400" : ""} />
            </button>

            <button
                onClick={() => handleFormatClick('underline')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!selectionRange || selectionRange.start === selectionRange.end}
            >
                <Underline size={18} className={!selectionRange || selectionRange.start === selectionRange.end ? "text-gray-400" : ""} />
            </button>

            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

            <button
                onClick={handleChecklistClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <List size={18} />
            </button>

            <div className="relative">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Palette size={18} />
                </button>

                {showColorPicker && (
                    <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {predefinedColors.map(color => (
                            <button
                                key={color}
                                onClick={() => {
                                    onChangeBackgroundColor(color);
                                    setShowColorPicker(false);
                                }}
                                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            <button
                onClick={handleImageClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <Image size={18} />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
            </button>
        </motion.div>
    );
};
