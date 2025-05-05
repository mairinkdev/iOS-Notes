import { useState } from 'react';
import { NoteFormat } from '../store/useNotesStore';

type FormatType = 'bold' | 'italic' | 'underline';

export const useTextFormatting = (initialFormatting?: NoteFormat) => {
    const [formatting, setFormatting] = useState<NoteFormat>(initialFormatting || {
        bold: [],
        italic: [],
        underline: [],
        checklist: []
    });

    // Aplica formatação ao texto selecionado
    const applyFormat = (type: FormatType, start: number, end: number) => {
        if (start === end) return; // Nenhuma seleção

        setFormatting(prev => {
            const newFormatting = { ...prev };

            // Inicializa o array se não existir
            if (!newFormatting[type]) {
                newFormatting[type] = [];
            }

            // Adiciona o range de formatação
            newFormatting[type] = [
                ...(newFormatting[type] || []),
                { start, end }
            ];

            return newFormatting;
        });
    };

    // Remove formatação de um range específico
    const removeFormat = (type: FormatType, start: number, end: number) => {
        setFormatting(prev => {
            const newFormatting = { ...prev };
            if (!newFormatting[type]) return newFormatting;

            newFormatting[type] = newFormatting[type]?.filter(
                range => !(range.start === start && range.end === end)
            );

            return newFormatting;
        });
    };

    // Verifica se um ponto específico do texto tem formatação
    const hasFormatAt = (type: FormatType, position: number) => {
        if (!formatting[type]) return false;

        return formatting[type]?.some(
            range => position >= range.start && position < range.end
        );
    };

    // Adiciona um item de checklist em uma posição
    const addChecklistItem = (position: number) => {
        setFormatting(prev => {
            const newFormatting = { ...prev };
            if (!newFormatting.checklist) {
                newFormatting.checklist = [];
            }

            newFormatting.checklist = [
                ...(newFormatting.checklist || []),
                { position, checked: false }
            ];

            return newFormatting;
        });
    };

    // Toggle estado de checked para um item específico
    const toggleChecklistItem = (position: number) => {
        setFormatting(prev => {
            const newFormatting = { ...prev };
            if (!newFormatting.checklist) return newFormatting;

            newFormatting.checklist = newFormatting.checklist.map(item =>
                item.position === position
                    ? { ...item, checked: !item.checked }
                    : item
            );

            return newFormatting;
        });
    };

    // Renderiza texto com formatação aplicada
    const renderFormattedText = (text: string) => {
        if (!text) return null;

        // Quebra o texto em pedaços com formatação
        const segments: { text: string; formats: FormatType[] }[] = [];

        // Função para determinar quais formatações se aplicam a cada posição
        const getFormatsAtPosition = (position: number) => {
            const formats: FormatType[] = [];

            if (hasFormatAt('bold', position)) formats.push('bold');
            if (hasFormatAt('italic', position)) formats.push('italic');
            if (hasFormatAt('underline', position)) formats.push('underline');

            return formats;
        };

        let currentPosition = 0;
        while (currentPosition < text.length) {
            const formats = getFormatsAtPosition(currentPosition);

            // Descobre o próximo ponto onde a formatação muda
            let nextFormatChange = text.length;

            ['bold', 'italic', 'underline'].forEach((type) => {
                formatting[type as FormatType]?.forEach(range => {
                    if (range.start > currentPosition && range.start < nextFormatChange) {
                        nextFormatChange = range.start;
                    }
                    if (range.end > currentPosition && range.end < nextFormatChange) {
                        nextFormatChange = range.end;
                    }
                });
            });

            // Adiciona o segmento atual
            segments.push({
                text: text.substring(currentPosition, nextFormatChange),
                formats
            });

            currentPosition = nextFormatChange;
        }

        // Constrói o JSX para os segmentos
        return segments.map((segment, index) => {
            let element = <span key={index}>{segment.text}</span>;

            segment.formats.forEach(format => {
                switch (format) {
                    case 'bold':
                        element = <strong key={index}>{element}</strong>;
                        break;
                    case 'italic':
                        element = <em key={index}>{element}</em>;
                        break;
                    case 'underline':
                        element = <u key={index}>{element}</u>;
                        break;
                }
            });

            return element;
        });
    };

    return {
        formatting,
        setFormatting,
        applyFormat,
        removeFormat,
        hasFormatAt,
        addChecklistItem,
        toggleChecklistItem,
        renderFormattedText
    };
};
