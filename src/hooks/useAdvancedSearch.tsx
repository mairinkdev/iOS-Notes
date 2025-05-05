import { useState, useEffect } from 'react';
import { useNotesStore, Note } from '../store/useNotesStore';

export type SearchOptions = {
    inTitle?: boolean;
    inContent?: boolean;
    caseSensitive?: boolean;
    matchWholeWord?: boolean;
    onlyFavorites?: boolean;
    categoryId?: string;
    dateFrom?: Date;
    dateTo?: Date;
};

export function useAdvancedSearch() {
    const { notes } = useNotesStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({
        inTitle: true,
        inContent: true,
        caseSensitive: false,
        matchWholeWord: false,
        onlyFavorites: false,
    });
    const [searchResults, setSearchResults] = useState<Note[]>([]);

    // Executa a pesquisa quando a query ou opções mudarem
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults(notes);
            return;
        }

        let query = searchQuery;
        if (!searchOptions.caseSensitive) {
            query = query.toLowerCase();
        }

        const filtered = notes.filter(note => {
            // Filtro por favoritos
            if (searchOptions.onlyFavorites && !note.isFavorite) {
                return false;
            }

            // Filtro por categoria
            if (searchOptions.categoryId && note.category !== searchOptions.categoryId) {
                return false;
            }

            // Filtro por data
            if (searchOptions.dateFrom) {
                const noteDate = new Date(note.updatedAt);
                if (noteDate < searchOptions.dateFrom) {
                    return false;
                }
            }

            if (searchOptions.dateTo) {
                const noteDate = new Date(note.updatedAt);
                const endOfDay = new Date(searchOptions.dateTo);
                endOfDay.setHours(23, 59, 59, 999);
                if (noteDate > endOfDay) {
                    return false;
                }
            }

            // Pesquisa no título
            if (searchOptions.inTitle) {
                let title = note.title;
                if (!searchOptions.caseSensitive) {
                    title = title.toLowerCase();
                }

                if (searchOptions.matchWholeWord) {
                    const words = title.split(/\s+/);
                    if (words.includes(query)) {
                        return true;
                    }
                } else if (title.includes(query)) {
                    return true;
                }
            }

            // Pesquisa no conteúdo
            if (searchOptions.inContent) {
                let content = note.content;
                if (!searchOptions.caseSensitive) {
                    content = content.toLowerCase();
                }

                if (searchOptions.matchWholeWord) {
                    const words = content.split(/\s+/);
                    if (words.includes(query)) {
                        return true;
                    }
                } else if (content.includes(query)) {
                    return true;
                }
            }

            return false;
        });

        setSearchResults(filtered);
    }, [searchQuery, searchOptions, notes]);

    // Função para limpar a pesquisa
    const clearSearch = () => {
        setSearchQuery('');
        setSearchOptions({
            inTitle: true,
            inContent: true,
            caseSensitive: false,
            matchWholeWord: false,
            onlyFavorites: false,
        });
    };

    // Função para atualizar as opções de pesquisa
    const updateSearchOptions = (options: Partial<SearchOptions>) => {
        setSearchOptions(prev => ({
            ...prev,
            ...options
        }));
    };

    // Função para destacar trechos nos resultados
    const highlightMatch = (text: string, search: string): JSX.Element => {
        if (!search || !text) return <>{text}</>;

        let compareText = text;
        let compareSearch = search;

        if (!searchOptions.caseSensitive) {
            compareText = text.toLowerCase();
            compareSearch = search.toLowerCase();
        }

        const index = compareText.indexOf(compareSearch);
        if (index === -1) return <>{text}</>;

        return (
            <>
                {text.substring(0, index)}
                <span className="bg-yellow-200 dark:bg-yellow-800">
                    {text.substring(index, index + search.length)}
                </span>
                {highlightMatch(text.substring(index + search.length), search)}
            </>
        );
    };

    return {
        searchQuery,
        setSearchQuery,
        searchOptions,
        updateSearchOptions,
        searchResults,
        clearSearch,
        highlightMatch
    };
}
