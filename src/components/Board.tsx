import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useWebSocket } from '../hooks/useWebSocket';
import DialogSystem from './DialogSystem/DialogSystem';
import Card from './Card';
import PlayerDeck from './PlayerDeck/PlayerDeck';
import TurnIndicator from './TurnIndicator';
import CardAnnouncement from './DialogSystem/CardAnnouncement';
import GameInfo from './GameInfo/GameInfo';
import NameEntry from './NameEntry/NameEntry';
import RevolverCylinder from './RevolverCylinder/RevolverCylinder';

const Board: React.FC = () => {
  const [playerId] = useState(() => uuidv4());
  const { playerState, playSelectedCards, revealPreviousCards, revealResult, sendName } = useWebSocket(playerId);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  // Obtiene el número de intentos restantes (attemptsLeft) del jugador actual
  const currentPlayerAttemptsLeft = playerState.allPlayers[playerId]?.attemptsLeft ?? 6;

  const isPlayerBanned = playerState.bannedPlayers.has(playerId);

  const toggleCardSelection = (card: string) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(card)
        ? prevSelected.filter((c) => c !== card)
        : [...prevSelected, card]
    );
  };

  const handlePlayCards = () => {
    if (!isPlayerBanned && selectedCards.length > 0 && playerState.currentTurn === playerId) {
      playSelectedCards(selectedCards);
      setSelectedCards([]);
    }
  };

  const handleRevealPreviousCards = () => {
    if (playerState.currentTurn === playerId) {
      revealPreviousCards();
    }
  };

  const playerPosition = playerState.allPlayers[playerId]?.position ?? 1;
  const rightPosition = (playerPosition % 4) + 1;
  const topPosition = ((playerPosition + 1) % 4) + 1;
  const leftPosition = ((playerPosition + 2) % 4) + 1;

  const rightPlayer = Object.keys(playerState.allPlayers).find(
    (id) => playerState.allPlayers[id].position === rightPosition
  ) || "";
  const topPlayer = Object.keys(playerState.allPlayers).find(
    (id) => playerState.allPlayers[id].position === topPosition
  ) || "";
  const leftPlayer = Object.keys(playerState.allPlayers).find(
    (id) => playerState.allPlayers[id].position === leftPosition
  ) || "";

  const isTurnActive = playerState.currentTurn === playerId;

  const getTurnDirection = () => {
    if (playerState.currentTurn === playerId) return 'bottom';
    if (playerState.currentTurn === rightPlayer) return 'right';
    if (playerState.currentTurn === topPlayer) return 'top';
    if (playerState.currentTurn === leftPlayer) return 'left';
    return 'bottom';
  };

  const getCurrentPlayerName = () => {
    const currentPlayer = playerState.currentTurn;
    return currentPlayer ? playerState.allPlayers[currentPlayer]?.name || 'Jugador' : 'Jugador';
  };

  const playerPositions: { [key: string]: 'top' | 'right' | 'bottom' | 'left' } = {
    [playerId]: 'bottom',
    [rightPlayer]: 'right',
    [topPlayer]: 'top',
    [leftPlayer]: 'left',
  };

  const bulletLeft = playerState.allPlayers[leftPlayer]?.attemptsLeft ?? 6;
  const bulletRight = playerState.allPlayers[rightPlayer]?.attemptsLeft ?? 6;
  const bulletTop = playerState.allPlayers[topPlayer]?.attemptsLeft ?? 6;

  if (!playerState.isGameStarted) {
    return (
      <NameEntry
        sendName={sendName}
        readyPlayers={playerState.readyPlayers}
        connectedPlayers={playerState.connectedPlayers}
      />
    );
  }

  const activePlayers = Object.keys(playerState.allPlayers).filter(
    (id) => !playerState.bannedPlayers.has(id)
  );

  // Si solo queda un jugador y es el usuario actual, establecer como ganador
  if (activePlayers.length === 1 && activePlayers[0] === playerId) {
    setIsWinner(true);
  }

  return (
    <div className={`relative flex flex-col items-center p-4 rounded-lg min-h-screen h-full ${isTurnActive ? 'bg-black bg-opacity-30 inset-0 z-40' : ''}`}>
      {isWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold text-green-500">¡Felicidades! Eres el ganador 🎉</h1>
          </div>
        </div>
      )}
      <GameInfo connectedPlayers={playerState.connectedPlayers} cardType={playerState.cardType} />

      <CardAnnouncement 
        message={playerState.announcement} 
        isVisible={!!playerState.announcement} 
        playerId={playerId} 
        currentPlayerId={playerState.currentTurn || playerId} 
        playerPositions={playerPositions}
      />
      
      <DialogSystem
        dialogs={playerState.dialog || []}
        playerId={playerId}
        playerPositions={playerPositions}
      />
      
      <TurnIndicator 
        direction={getTurnDirection() as 'top' | 'right' | 'bottom' | 'left'} 
        playerName={getCurrentPlayerName()}
      />

      {/* Mostrar las últimas cartas jugadas si revealActive es true */}
      {playerState.lastPlayedCards && playerState.lastPlayedCards.length > 0 && (
        <div className="absolute top-1/2 transform -translate-y-1/2 z-20 p-2 flex space-x-2 mt-[60px]">
          {playerState.lastPlayedCards.map((card, idx) => (
            <div key={idx} className="w-12 h-16 bg-white border border-gray-400 flex items-center justify-center rounded shadow-lg cursor-pointer">
              {playerState.revealActive ? (
                <span className="text-xl font-bold text-black">{card}</span>
              ) : (
                <div className="w-full h-full bg-gray-700 rounded"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Top Player's Cards */}
      <div className="flex flex-col items-center mt-5">
        <span className="text-gray-300 text-xs text-center mb-1">
          Arriba ({playerState.allPlayers[topPlayer]?.remaining || 0} cartas)
        </span>
        <p className='text-2xl font-bold text-center text-white mt-2 mb-2'>
          {playerState.allPlayers[topPlayer]?.name || ''}
        </p>
        <div className="relative flex gap-1 z-10">
          {Array(playerState.allPlayers[topPlayer]?.remaining || 0).fill(null).map((_, idx) => (
            <Card 
              key={`top-${idx}`} 
              value={"dorso"} 
              isBanned={playerState.bannedPlayers.has(topPlayer)}
            />
          ))}
          <div className="absolute z-50 left-[100%]">
              <RevolverCylinder usedBullets={bulletTop} size={70}/>
            </div>
        </div>
      </div>

      <div className="flex justify-between w-full gap-4 flex-1 z-10">
        {/* Left Player's Cards */}
        <div className="flex flex-col items-center gap-1 justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-300 text-xs">
              Izquierda ({playerState.allPlayers[leftPlayer]?.remaining || 0} cartas)
            </span>
            <p className='text-2xl font-bold text-center text-white mt-2 mb-2'>
              {playerState.allPlayers[leftPlayer]?.name || ''}
            </p>
            <div className="relative flex flex-col gap-1 align-center justify-center">
              {Array(playerState.allPlayers[leftPlayer]?.remaining || 0).fill(null).map((_, idx) => (
                <Card 
                  key={`left-${idx}`} 
                  value={"dorso"} 
                  isBanned={playerState.bannedPlayers.has(leftPlayer)}
                />
              ))}
              <div className="absolute z-50 bottom-[-20%] left-[-10px]">
                <RevolverCylinder usedBullets={bulletLeft} size={70}/>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Right Player's Cards */}
        <div className="flex flex-col items-center gap-1 justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-300 text-xs">
              Derecha ({playerState.allPlayers[rightPlayer]?.remaining || 0} cartas)
            </span>
            <p className='text-2xl font-bold text-center text-white mt-2 mb-2'>
              {playerState.allPlayers[rightPlayer]?.name || ''}
            </p>
            <div className="relative flex flex-col gap-1">
              {Array(playerState.allPlayers[rightPlayer]?.remaining || 0).fill(null).map((_, idx) => (
                <Card 
                  key={`right-${idx}`} 
                  value={"dorso"} 
                  isBanned={playerState.bannedPlayers.has(rightPlayer)}
                />
              ))}
              <div className="absolute z-50 bottom-[-20%] left-[-10px]">
                <RevolverCylinder usedBullets={bulletRight} size={70}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Player's Cards */}
      <div className="mt-4 z-10">
        <PlayerDeck
          cards={playerState.cards}
          selectedCards={selectedCards}
          isBanned={isPlayerBanned}
          onCardSelect={toggleCardSelection}
        />
      </div>

      <div className="flex flex-col z-10 mt-4">
        <button
          onClick={handleRevealPreviousCards}
          className={`px-6 py-3 bg-red-500 text-white rounded-lg transition-all duration-300 z-10
            ${!isPlayerBanned && isTurnActive && playerState.lastPlayedCards.length > 0
              ? 'bg-red-500 hover:bg-red-600 transform hover:-translate-y-1'
              : 'bg-gray-500 cursor-not-allowed'}`}
          disabled={(!isTurnActive || isPlayerBanned)}
        >
          Revelar Cartas
        </button>

        <button
          onClick={handlePlayCards}
          className={`mt-4 px-6 py-3 text-white rounded-lg transition-all duration-300 z-10
            ${!isPlayerBanned && isTurnActive && selectedCards.length > 0
              ? 'bg-blue-500 hover:bg-blue-600 transform hover:-translate-y-1'
              : 'bg-gray-500 cursor-not-allowed'}`}
          disabled={isPlayerBanned || !isTurnActive || selectedCards.length === 0}
        >
          Jugar Cartas
        </button>
      </div>

      {/* RevolverCylinder component */}
      <div className="fixed bottom-4 right-4 z-50">
        <RevolverCylinder usedBullets={currentPlayerAttemptsLeft} />
      </div>
    </div>
  );
};

export default Board; 