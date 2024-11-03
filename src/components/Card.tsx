import React from 'react';

interface CardProps {
  value: string;
  isSelected?: boolean;
  isBanned?: boolean; // Añadimos isBanned como propiedad opcional
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ value, isSelected = false, isBanned = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-12 h-16 flex items-center justify-center rounded shadow-lg cursor-pointer 
        ${isBanned ? 'bg-red-700' : isSelected ? 'bg-blue-500' : 'bg-white'} 
        ${isBanned ? 'text-gray-300' : 'text-black'} 
        border border-gray-400`}
    >
      {value === "dorso" ? (
        <div className={`${isBanned ? 'bg-red-800' : 'bg-gray-700'} w-full h-full rounded`}></div>
      ) : (
        <span className="text-xl font-bold">{value}</span>
      )}
    </div>
  );
};

export default Card;
