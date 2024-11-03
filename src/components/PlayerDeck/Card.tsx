import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  value: string;
  isSelected?: boolean;
  isBanned?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ value, isSelected = false, isBanned = false, onClick }) => {
  const [suit, number] = value !== "dorso" ? value.split('') : ['', ''];
  const isRed = suit === '♥' || suit === '♦';

  return (
    <motion.div
      onClick={onClick}
      className={`w-24 h-36 flex items-center justify-center rounded-xl cursor-pointer 
        ${isBanned ? 'bg-red-700' : 'bg-white'}
        ${isSelected ? 'ring-4 ring-blue-500' : ''}
        shadow-[2px_2px_10px_rgba(0,0,0,0.15)]
        hover:shadow-[2px_2px_15px_rgba(0,0,0,0.25)]
        transition-shadow duration-200`}
      whileTap={{ scale: 0.98 }}
    >
      {value === "dorso" ? (
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-[1px]">
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 background-pattern" />
        </div>
      ) : (
        <div className={`relative w-full h-full p-2`}>
          {/* Esquina Superior */}
          <div className={`absolute top-1 left-2 text-lg font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
            {number}
            <div className="text-2xl -mt-1">{suit}</div>
          </div>
          
          {/* Centro */}
          <div className={`absolute inset-0 flex items-center justify-center text-4xl ${isRed ? 'text-red-600' : 'text-black'}`}>
            {suit}
          </div>
          
          {/* Esquina Inferior */}
          <div className={`absolute bottom-1 right-2 text-lg font-bold rotate-180 ${isRed ? 'text-red-600' : 'text-black'}`}>
            {number}
            <div className="text-2xl -mt-1">{suit}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Card;