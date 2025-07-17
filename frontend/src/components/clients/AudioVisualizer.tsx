import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, className = '' }) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: 5 }, () => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setBars([]);
    }
  }, [isActive]);

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
          style={{
            height: isActive ? `${bars[i] || 20}%` : '20%',
            maxHeight: '40px',
            minHeight: '8px',
          }}
          animate={{
            height: isActive ? `${bars[i] || 20}%` : '20%',
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};