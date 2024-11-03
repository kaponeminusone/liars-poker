import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface DialogBubbleProps {
  message: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  isCurrentPlayer: boolean;
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

export const DialogBubble: React.FC<DialogBubbleProps> = ({ message, position, isCurrentPlayer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: position === 'bottom' ? 20 : position === 'top' ? -20 : 0, x: position === 'left' ? -20 : position === 'right' ? 20 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute z-50 ${positionStyles[position]}`}
    >
      <div className={`relative ${isCurrentPlayer ? 'bg-blue-500' : 'bg-gray-700'} text-white p-4 rounded-lg shadow-lg max-w-xs`}>
        <div className={`absolute ${arrowStyles[position]} w-4 h-4 ${isCurrentPlayer ? 'bg-blue-500' : 'bg-gray-700'} transform rotate-45`} />
        <div className="flex items-start gap-2">
          <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DialogBubble;