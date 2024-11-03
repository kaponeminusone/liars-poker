// server.js
import { WebSocketServer } from 'ws';
import express from 'express';
import { random } from './random.js';

const app = express();
const wss = new WebSocketServer({ port: 4000 });

let players = {};
let deck = [
  'A♥', 'A♠', 'A♣', 'A♦',
  'K♥', 'K♠', 'K♣', 'K♦',
  'Q♥', 'Q♠', 'Q♣', 'Q♦',
  'J♥', 'J♠', 'J♣', 'J♦'
];
const MAX_PLAYERS = 4;
let playerPositions = {};
let positionIndex = 1;
let currentTurnIndex = 1;
let lastPlayedCards = [];
let lastPlayerId = null;
let cardType = getRandomCardType();
let revealActive = false;
let bannedPlayers = new Set();
let readyPlayers = new Set(); // Almacena jugadores listos

function getRandomCardType() {
  const cardTypes = ['A', 'K', 'Q', 'J'];
  return cardTypes[Math.floor(random() * cardTypes.length)];
}

function assignRevealLimit(playerId) {
  players[playerId].revealLimit = Math.floor(random() * 6) + 1;
  players[playerId].revealCount = 0;
}

wss.on('connection', (ws) => {
  console.log('Nuevo cliente intentando conectarse.');

  if (Object.keys(players).length >= MAX_PLAYERS) {
    console.log('La sala está llena. Rechazando la conexión.');
    ws.send(JSON.stringify({ type: 'error', message: 'La sala está llena. Intenta nuevamente más tarde.' }));
    ws.close();
    return;
  }

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Mensaje recibido del servidor:', data);

    if (data.type === 'enterName') {
      const playerId = data.playerId;

      if (players[playerId]) {
        players[playerId].name = data.name;
        readyPlayers.add(playerId); // Marca al jugador como listo
        broadcastReadyPlayers();

        if (readyPlayers.size === MAX_PLAYERS) {
          startGame();
          for (const playerId in players) assignRevealLimit(playerId);
          broadcastReadyPlayers();
          broadcastRemainingCards();
        }
      }
    }

    if (data.type === 'join') {
      const playerId = data.playerId;

      if (players[playerId]) {
        console.log(`El jugador ${playerId} ya está conectado. Ignorando.`);
        return;
      }

      const playerCards = deck.sort(() => 0.5 - random()).slice(0, 5);
      playerPositions[playerId] = positionIndex++;
      players[playerId] = { ws, cards: playerCards, remaining: 5 };
      assignRevealLimit(playerId);

      console.log(`Jugador ${playerId} con el nombre:`, data.name);

      ws.send(JSON.stringify({
        type: 'initialState',
        name: data.name,
        playerId,
        position: playerPositions[playerId],
        cards: playerCards,
        remainingCards: Object.fromEntries(
          Object.entries(players).map(([id, player]) => [id, player.remaining])
        ),
        connectedPlayers: Object.keys(players).length,
        allPlayers: playerPositions,
        currentTurn: getCurrentTurnPlayerId(),
        lastPlayedCards,
        cardType,
        revealActive,
        bannedPlayers: Array.from(bannedPlayers)
      }));

      broadcastPlayerCount();
      broadcastRemainingCards();
    }

    if (data.type === 'playCard' && players[data.playerId]) {
      if (bannedPlayers.has(data.playerId)) {
        advanceTurn();
        return;
      }

      const selectedCards = data.selectedCards;
      players[data.playerId].remaining -= selectedCards.length;
      lastPlayedCards = selectedCards;
      lastPlayerId = data.playerId;

      revealActive = false;
      broadcastAnnouncement(`${selectedCards.length} ${cardType}(s) en juego`);
      broadcastRemainingCards();

      setTimeout(() => {
        advanceTurn();
      }, 2010);
    }

    if (data.type === 'revealPreviousCards' && data.playerId === getCurrentTurnPlayerId()) {
      if (lastPlayerId) {
        broadcastDialog([
          { player: data.playerId, message: '¡Mentiroso! revelemos las cartas!' },
          { player: lastPlayerId, message: '¿Yo? Que así sea...' }
        ]);

        setTimeout(() => {
          const isValid = lastPlayedCards.every(card => card.startsWith(cardType));
          revealActive = true;

          if (isValid) {
            players[data.playerId].revealCount += 1;
            if (players[data.playerId].revealCount >= players[data.playerId].revealLimit) {
              bannedPlayers.add(data.playerId);
              console.log(`Jugador ${data.playerId} ha sido sancionado por alcanzar el límite de revelaciones.`);
              lastPlayedCards = [];
              lastPlayerId = data.playerId;
              revealActive = false;
              
              broadcastDialog([
                { player: lastPlayerId, message: 'JA JA JA!'},
                { player: data.playerId, message: '... (die)' }
              ]);

              advanceTurn();
            }else{
                broadcastDialog([
                  { player: lastPlayerId, message: 'No tuviste Fe JA JA JA!'},
                  { player: data.playerId, message: 'UFFF, ME SALVEE!!' }
                ]);
            }
          } else {
            players[lastPlayerId].revealCount += 1;
            if (players[lastPlayerId].revealCount >= players[lastPlayerId].revealLimit) {
              bannedPlayers.add(lastPlayerId);
              console.log(`Jugador ${lastPlayerId} ha sido sancionado por alcanzar el límite de revelaciones.`);

              broadcastDialog([
                { player: data.playerId, message: 'Mentiroso muelto!'},
                { player: lastPlayerId, message: '... (die)' }
              ]);

            }else{
              broadcastDialog([
                { player: data.playerId, message: 'Te salvaste por nada... mentiroso!'},
                { player: lastPlayerId, message: 'La suerte está de mi lado'}
              ]);
            }
          }

          cardType = getRandomCardType();
          console.log(`Nuevo tipo de carta asignado para la próxima ronda: ${cardType}`);

          for (const playerId in players) {
            players[playerId].ws.send(JSON.stringify({
              type: 'revealResult',
              isValid,
              message: isValid ? 'Las cartas corresponden al tipo asignado.' : 'Las cartas NO corresponden al tipo asignado.',
              revealActive,
              lastPlayedCards,
              cardType,
              bannedPlayers: Array.from(bannedPlayers)
            }));
          }

          broadcastRemainingCards()
          
        }, 3000); // Espera 3 segundos antes de la verificación
      }
    }
  });

  ws.on('close', () => {
    const disconnectedPlayer = Object.keys(players).find(
      (playerId) => players[playerId].ws === ws
    );

    if (disconnectedPlayer) {
      delete players[disconnectedPlayer];
      const disconnectedPosition = playerPositions[disconnectedPlayer];
      readyPlayers.delete(disconnectedPlayer);
      delete playerPositions[disconnectedPlayer];

      console.log(`Jugador ${disconnectedPlayer} se ha desconectado.`);

      Object.keys(playerPositions).forEach((id) => {
        if (playerPositions[id] > disconnectedPosition) {
          playerPositions[id] -= 1;
        }
      });

      positionIndex -= 1;
      broadcastPlayerCount();
      broadcastRemainingCards();
    }
  });
});

function startGame() {
  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({ type: 'startGame' }));
  }
}

function broadcastReadyPlayers() {
  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({
      type: 'readyPlayersUpdate',
      readyPlayers: Array.from(readyPlayers),
    }));
  }
}

function getCurrentTurnPlayerId() {
  return Object.keys(playerPositions).find((id) => playerPositions[id] === currentTurnIndex);
}

function advanceTurn() {
  do {
    currentTurnIndex = (currentTurnIndex % MAX_PLAYERS) + 1;
  } while (bannedPlayers.has(getCurrentTurnPlayerId()));

  const currentTurnPlayerId = getCurrentTurnPlayerId();
  console.log(`Turno cambiado al jugador: ${currentTurnPlayerId}  ${players[currentTurnPlayerId].name}`);
  revealActive = false;
  broadcastTurnChange(currentTurnPlayerId);
}

function broadcastTurnChange(currentTurnPlayerId) {
  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({
      type: 'turnChange',
      currentTurn: currentTurnPlayerId,
      lastPlayedCards,
      cardType,
      revealActive,
      bannedPlayers: Array.from(bannedPlayers)
    }));
  }
}

function broadcastAnnouncement(message) {
  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({
      type: 'announcement',
      message
    }));
  }
}

function broadcastDialog(dialogs) {
  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({
      type: 'dialogEvent',
      dialogs
    }));
  }
}

function broadcastRemainingCards() {
  const playerStates = Object.fromEntries(
    Object.entries(players).map(([id, player]) => [
      id, 
      {
        remaining: player.remaining,
        position: playerPositions[id],
        name: players[id].name,
        attemptsLeft: player.revealCount,
      }
    ])
  );

  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({
      type: 'updateAllPlayers',
      playerStates,
      currentTurn: getCurrentTurnPlayerId(),
      lastPlayedCards,
      cardType,
      revealActive,
      bannedPlayers: Array.from(bannedPlayers)
    }));
  }
}

function broadcastPlayerCount() {
  const connectedPlayers = Object.keys(players).length;

  for (const playerId in players) {
    players[playerId].ws.send(JSON.stringify({
      type: 'playerCount',
      connectedPlayers
    }));
  }
}

app.get('/reset', (req, res) => {
  bannedPlayers.clear();
  console.log('Todos los jugadores han sido restablecidos.');
  res.send('Partida restablecida. Todos los jugadores pueden participar nuevamente.');
});

app.listen(3000, () => {
  console.log('Servidor de REST API ejecutándose en http://localhost:3000');
});

console.log('Servidor WebSocket ejecutándose en ws://localhost:4000');
