import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  isOnline: boolean;
  error?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  isOnline, 
  error, 
  className = '' 
}) => {
  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {error ? (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-500">Erreur de connexion</span>
        </>
      ) : (
        <>
          <motion.div
            animate={{ rotate: isOnline ? 360 : 0 }}
            transition={{ duration: 1, repeat: isOnline ? Infinity : 0 }}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-500" />
            )}
          </motion.div>
          <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </>
      )}
    </motion.div>
  );
};