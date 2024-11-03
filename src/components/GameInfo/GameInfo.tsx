import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Card from '../PlayerDeck/Card';

interface GameInfoProps {
  connectedPlayers: number;
  cardType: string;
}

export default function GameInfo({ connectedPlayers, cardType }: GameInfoProps) {
  // Convertir el cardType a un valor de carta válido
  const cardValue = `${cardType}♠`; // Usamos picas como comodín, ya que no sabemos el palo real

  return (
    <>
      {/* Tipo de carta */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-[20%] z-20 align-center"
      >
        
        <motion.p
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl font-bold text-center mt-2"
          aria-label={`Tipo de carta actual: ${cardType}`}
        >
          <div className="relative flex justify-center">
          <Card value={cardValue} />
        </div>
          <p className='text-white'>Tipo Actual</p>
        </motion.p>
      </motion.div>

      {/* Jugadores conectados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-80 rounded-lg p-2 flex items-center space-x-2 shadow-md"
        aria-label={`${connectedPlayers} de 4 jugadores conectados`}
      >
        <Users className="w-5 h-5 text-gray-600" aria-hidden="true" />
        <p className="text-gray-700 text-sm font-medium">
          {connectedPlayers} / 4
        </p>
      </motion.div>
    </>
  );
}