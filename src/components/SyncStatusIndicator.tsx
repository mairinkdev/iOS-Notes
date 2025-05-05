import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface SyncStatusIndicatorProps {
    onClick?: () => void;
}

export const SyncStatusIndicator = ({ onClick }: SyncStatusIndicatorProps) => {
    const [status, setStatus] = useState<SyncStatus>('synced');

    // Simular verificação de status de sincronização
    useEffect(() => {
        const checkStatus = () => {
            // Verifica se o navegador está online
            if (!navigator.onLine) {
                setStatus('offline');
                return;
            }

            // Simula pequena chance de erro para demonstração
            const random = Math.random();
            if (random < 0.05) {
                setStatus('error');
                return;
            }

            // Simula sincronização
            setStatus('syncing');

            // Após um tempo, marca como sincronizado
            setTimeout(() => {
                setStatus('synced');
            }, 1500);
        };

        // Verifica o status inicialmente
        checkStatus();

        // Configura verificação periódica
        const interval = setInterval(checkStatus, 60000); // A cada minuto

        // Adiciona ouvintes para mudanças na conexão
        window.addEventListener('online', () => checkStatus());
        window.addEventListener('offline', () => setStatus('offline'));

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', checkStatus);
            window.removeEventListener('offline', checkStatus);
        };
    }, []);

    const getStatusDetails = () => {
        switch (status) {
            case 'synced':
                return {
                    icon: <Cloud size={16} />,
                    text: 'Sincronizado',
                    color: 'text-green-500'
                };
            case 'syncing':
                return {
                    icon: <RefreshCw size={16} className="animate-spin" />,
                    text: 'Sincronizando...',
                    color: 'text-blue-500'
                };
            case 'offline':
                return {
                    icon: <CloudOff size={16} />,
                    text: 'Offline',
                    color: 'text-gray-500'
                };
            case 'error':
                return {
                    icon: <CloudOff size={16} />,
                    text: 'Erro de sincronização',
                    color: 'text-red-500'
                };
            default:
                return {
                    icon: <Cloud size={16} />,
                    text: 'Desconhecido',
                    color: 'text-gray-500'
                };
        }
    };

    const { icon, text, color } = getStatusDetails();

    return (
        <motion.button
            className={`flex items-center text-xs ${color} px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
        >
            {icon}
            <span className="ml-1">{text}</span>
        </motion.button>
    );
};
