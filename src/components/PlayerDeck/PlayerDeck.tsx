import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';

interface PlayerDeckProps {
  cards: string[];
  selectedCards: string[];
  isBanned: boolean;
  onCardSelect: (card: string) => void;
}

const PlayerDeck: React.FC<PlayerDeckProps> = ({
  cards,
  selectedCards,
  isBanned,
  onCardSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const calculateRotation = (index: number, total: number) => {
    const middleIndex = (total - 1) / 2;
    const rotationAngle = (index - middleIndex) * 3;
    return rotationAngle;
  };

  const calculateOffset = (index: number, total: number) => {
    const middleIndex = (total - 1) / 2;
    const baseOffset = index * 35;
    const centeringOffset = -(total * 15);
    return baseOffset + centeringOffset;
  };

  return (
    <motion.div
      className="relative h-32 perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex justify-center relative">
        {cards.map((card, idx) => {
          const rotation = calculateRotation(idx, cards.length);
          const xOffset = calculateOffset(idx, cards.length);
          
          return (
            <motion.div
              key={`${card}-${idx}`}
              initial={false}
              animate={{
                rotate: rotation,
                x: isHovered ? xOffset * 2.5 : xOffset, // Incremento en la separación horizontal
                y: isHovered ? -30 : 0, // Incremento en el desplazamiento vertical en hover
                zIndex: idx,
                transition: {
                  type: "tween",
                  stiffness: 150,
                  damping: 15
                },
              }}
              style={{
                position: 'absolute',
                transformOrigin: "bottom center"
              }}
              whileHover={{
                y: -30, // Incremento en el levantamiento de la carta al pasar el mouse por encima
                scale: 1.1,
                zIndex: 100,
                transition: {
                  duration: 0.2
                }
              }}
              className="origin-bottom"
            >
              <Card
                value={card}
                isSelected={selectedCards.includes(card)}
                isBanned={isBanned}
                onClick={() => onCardSelect(card)}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PlayerDeck;