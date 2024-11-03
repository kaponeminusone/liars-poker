import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DialogBubble from './DialogBubble';

interface Dialog {
  player: string;
  message: string;
}

interface DialogSystemProps {
  dialogs: Dialog[];
  playerId: string;
  playerPositions: {
    [key: string]: 'top' | 'right' | 'bottom' | 'left';
  };
  displayDuration?: number; // Tiempo de visualización opcional en milisegundos
  pauseDuration?: number;   // Tiempo de pausa opcional en milisegundos
}

export const DialogSystem: React.FC<DialogSystemProps> = ({
  dialogs,
  playerId,
  playerPositions,
  displayDuration = 1400, // Valor predeterminado de 3 segundos
  pauseDuration = 10    // Valor predeterminado de 3 segundos
}) => {
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);

  useEffect(() => {
    if (dialogs.length > 0) {
      const showDialog = (index: number) => {
        if (index < dialogs.length) {
          setCurrentDialog(dialogs[index]);
          setTimeout(() => {
            setCurrentDialog(null);
            setTimeout(() => showDialog(index + 1), pauseDuration);
          }, displayDuration);
        }
      };

      showDialog(0);
    }
  }, [dialogs, displayDuration, pauseDuration]);

  if (!currentDialog) return null;

  const position = playerPositions[currentDialog.player] || 'bottom';
  const isCurrentPlayer = currentDialog.player === playerId;

  return (
    <AnimatePresence>
      <DialogBubble
        message={currentDialog.message}
        position={position}
        isCurrentPlayer={isCurrentPlayer}
      />
    </AnimatePresence>
  );
};

export default DialogSystem;
