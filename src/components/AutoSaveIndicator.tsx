import { useState, useEffect } from 'react';
import { Check, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AutoSaveIndicatorProps {
    saving: boolean;
    lastSaved?: number;
}

export const AutoSaveIndicator = ({ saving, lastSaved }: AutoSaveIndicatorProps) => {
    const [showSavedMessage, setShowSavedMessage] = useState(false);

    // Mostre a mensagem "Salvo" por alguns segundos quando o salvamento for concluído
    useEffect(() => {
        if (!saving && lastSaved) {
            setShowSavedMessage(true);
            const timer = setTimeout(() => {
                setShowSavedMessage(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [saving, lastSaved]);

    // Formata o tempo de último salvamento
    const formatLastSaved = () => {
        if (!lastSaved) return '';

        const now = new Date();
        const saved = new Date(lastSaved);

        // Se foi salvo há menos de 1 minuto, mostre "Agora"
        if (now.getTime() - saved.getTime() < 60 * 1000) {
            return 'Agora';
        }

        // Se foi salvo há menos de 1 hora, mostre os minutos
        if (now.getTime() - saved.getTime() < 60 * 60 * 1000) {
            const minutes = Math.floor((now.getTime() - saved.getTime()) / (60 * 1000));
            return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        }

        // Caso contrário, mostre as horas
        const hours = Math.floor((now.getTime() - saved.getTime()) / (60 * 60 * 1000));
        return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    };

    return (
        <motion.div
            className="flex items-center text-xs text-ios-secondary-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {saving ? (
                // Mostrar indicador de salvamento
                <div className="flex items-center">
                    <RefreshCw size={14} className="mr-1 animate-spin" />
                    <span>Salvando...</span>
                </div>
            ) : showSavedMessage ? (
                // Mostrar confirmação de salvamento
                <motion.div
                    className="flex items-center text-green-500"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                >
                    <Check size={14} className="mr-1" />
                    <span>Salvo</span>
                </motion.div>
            ) : lastSaved ? (
                // Mostrar quando foi salvo pela última vez
                <div className="flex items-center">
                    <Save size={14} className="mr-1" />
                    <span>Salvo {formatLastSaved()}</span>
                </div>
            ) : null}
        </motion.div>
    );
};
