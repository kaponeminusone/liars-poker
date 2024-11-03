// src/hooks/useWebSocket.ts

import { useEffect, useState } from 'react';

const WS_URL = 'ws://localhost:4000';

type PlayerInfo = {
  name: string;
  remaining: number;
  position: number;
  attemptsLeft: number; // Añadimos attemptsLeft aquí
};

type Dialog = { player: string; message: string };

type PlayerState = {
  name: string;
  playerId: string;
  cards: string[];
  remainingCards: Record<string, number>;
  connectedPlayers: number;
  allPlayers: Record<string, PlayerInfo>;
  currentTurn: string | null;
  lastPlayedCards: string[];
  cardType: string;
  revealActive: boolean;
  bannedPlayers: Set<string>;
  dialog?: Dialog[];
  announcement: string;
  readyPlayers: string[]; // Lista de jugadores listos
  isGameStarted: boolean; // Estado de inicio del juego
};

export const useWebSocket = (playerId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    name: '',
    playerId,
    cards: [],
    remainingCards: {},
    connectedPlayers: 1,
    allPlayers: {},
    currentTurn: null,
    lastPlayedCards: [],
    cardType: '',
    revealActive: false,
    bannedPlayers: new Set(),
    dialog: [],
    announcement: '',
    readyPlayers: [],
    isGameStarted: false,
  });
  
  const [revealResult, setRevealResult] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log('Conectado al WebSocket');
      ws.send(JSON.stringify({ type: 'join', playerId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido del servidor:', data);

      if (data.type === 'initialState' && data.playerId === playerId) {
        setPlayerState((prev) => ({
          ...prev,
          name: data.name,
          cards: data.cards,
          remainingCards: data.remainingCards,
          connectedPlayers: data.connectedPlayers,
          allPlayers: data.allPlayers,
          currentTurn: data.currentTurn,
          lastPlayedCards: data.lastPlayedCards,
          cardType: data.cardType,
          revealActive: data.revealActive,
          bannedPlayers: new Set(data.bannedPlayers),
        }));
      } else if (data.type === 'updateAllPlayers') {
        setPlayerState((prev) => ({
          ...prev,
          name: data.name,
          allPlayers: data.playerStates,
          currentTurn: data.currentTurn,
          lastPlayedCards: data.lastPlayedCards,
          cardType: data.cardType,
          revealActive: data.revealActive,
          bannedPlayers: new Set(data.bannedPlayers),
        }));
      } else if (data.type === 'turnChange') {
        setPlayerState((prev) => ({
          ...prev,
          currentTurn: data.currentTurn,
          lastPlayedCards: data.lastPlayedCards,
          cardType: data.cardType,
          revealActive: data.revealActive,
          bannedPlayers: new Set(data.bannedPlayers),
        }));
      } else if (data.type === 'revealResult') {
        setRevealResult(data.message);
        setPlayerState((prev) => ({
          ...prev,
          revealActive: data.revealActive,
          lastPlayedCards: data.lastPlayedCards,
          bannedPlayers: new Set(data.bannedPlayers),
        }));
      } else if (data.type === 'playerCount') {
        setPlayerState((prev) => ({
          ...prev,
          connectedPlayers: data.connectedPlayers,
        }));
      } else if (data.type === 'dialogEvent') {
        setPlayerState((prev) => ({
          ...prev,
          dialog: data.dialogs
        }));
        setTimeout(() => setPlayerState((prev) => ({ ...prev, dialog: [] })), 3000);
      } else if (data.type === 'announcement') {
        setPlayerState((prev) => ({ ...prev, announcement: data.message }));
        setTimeout(() => setPlayerState((prev) => ({ ...prev, announcement: '' })), 2000);
      } else if (data.type === 'readyPlayersUpdate') {
        // Actualiza los jugadores listos
        setPlayerState((prev) => ({
          ...prev,
          readyPlayers: data.readyPlayers,
        }));
      } else if (data.type === 'startGame') {
        // Marca el inicio del juego
        setPlayerState((prev) => ({
          ...prev,
          isGameStarted: true,
        }));
      }
    };

    ws.onclose = () => console.log('Desconectado del WebSocket');
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [playerId]);

  const playSelectedCards = (selectedCards: string[]) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'playCard', playerId, selectedCards }));
      setPlayerState((prev) => ({
        ...prev,
        cards: prev.cards.filter((card) => !selectedCards.includes(card)),
      }));
    }
  };

  const revealPreviousCards = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'revealPreviousCards', playerId }));
    }
  };

  // Nuevo: Función para enviar el nombre del jugador al servidor
  const sendName = (name: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'enterName', playerId, name }));
    }
  };

  return { playerState, playSelectedCards, revealPreviousCards, sendName, revealResult };
};
