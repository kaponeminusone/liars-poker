import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface CardAnnouncementProps {
  message: string;
  isVisible: boolean;
  playerId: string;
  currentPlayerId: string;
  playerPositions: {
    [key: string]: 'top' | 'right' | 'bottom' | 'left';
  };
}

const positionStyles = {
  top: 'top-24 left-1/2 -translate-x-1/2',
  right: 'top-1/2 right-24 -translate-y-1/2',
  bottom: 'bottom-24 left-1/2 -translate-x-1/2',
  left: 'top-1/2 left-24 -translate-y-1/2',
};

const arrowStyles = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 rotate-180',
  right: 'left-0 top-1/2 -translate-y-1/2 rotate-90',
  bottom: 'top-0 left-1/2 -translate-x-1/2',
  left: 'right-0 top-1/2 -translate-y-1/2 -rotate-90',
};

export default function CardAnnouncement({
  message,
  isVisible,
  playerId,
  currentPlayerId,
  playerPositions,
}: CardAnnouncementProps) {
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setLocalMessage(message);
    }
  }, [message]);

  // Determinamos la posición de acuerdo con `playerPositions`
  const position = playerPositions[currentPlayerId] || 'bottom';
  const isCurrentPlayer = playerId === currentPlayerId;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
            y: position === 'bottom' ? 20 : position === 'top' ? -20 : 0,
            x: position === 'left' ? -20 : position === 'right' ? 20 : 0,
          }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute z-50 ${positionStyles[position]}`}
        >
          <div
            className={`relative ${
              isCurrentPlayer ? 'bg-green-500' : 'bg-purple-600'
            } text-white p-4 rounded-lg shadow-lg max-w-xs`}
          >
            <div
              className={`absolute ${arrowStyles[position]} w-4 h-4 ${
                isCurrentPlayer ? 'bg-green-500' : 'bg-purple-600'
              } transform rotate-45`}
            />
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-lg font-bold">{localMessage}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
