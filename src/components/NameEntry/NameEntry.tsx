import React, { useState } from 'react';
import { Club, Users, Info, Trophy, Settings, Loader2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import IconSwitcher from '../IconSwitcher/IconSwitcher';

interface NameEntryProps {
  sendName: (name: string) => void;
  readyPlayers: string[];
  connectedPlayers: number;
}

export default function NameEntry({ sendName, readyPlayers, connectedPlayers }: NameEntryProps) {
  const [name, setName] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  const handleEnter = () => {
    setIsWaiting(true);
    sendName(name);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-[#0C4A1F]"
    >
      {/* Left Sidebar */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-[#083618] p-6 border-r border-[#1a5c32]"
      >
        <div className="flex items-center justify-center  gap-3">
          <IconSwitcher></IconSwitcher>
          <h1 className="text-2xl font-bold text-white">Liar's Poker</h1>
        </div>
        
        <nav className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center gap-3 text-gray-300 w-full p-2 rounded-lg"
          >
            <Users className="w-5 h-5" />
            <span>Jugadores ({connectedPlayers})</span>
          </motion.div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://img.freepik.com/vector-premium/fondo-mesa-poquer-color-verde_47243-1571.jpg?w=1060')] bg-center bg-cover filter blur-sm"></div>
        </div>
        
        <div className="relative max-w-[80%] mx-auto grid grid-cols-2 gap-8">
          {/* Name Entry Section */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#083618] p-8 rounded-2xl shadow-xl h-[300px]"
          >
            <AnimatePresence mode="wait">
              {!isWaiting ? (
                <motion.div
                  key="nameEntry"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-white mb-6">Únete a la Mesa</h2>
                  <div>
                    <label className="block text-gray-300 mb-2">Tu nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0C4A1F] border border-[#1a5c32] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2d8049] transition-all"
                      placeholder="Ingresa tu nombre..."
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnter}
                    disabled={!name}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tomar Asiento
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center h-full py-12 space-y-6"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-12 h-12 text-red-500" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">Esperando jugadores...</h2>
                    <p className="text-gray-300">
                      ¡Bienvenido, {name}! Esperando a que los demás jugadores se unan.
                    </p>
                  </div>
                  <div className="text-center text-gray-300 pt-4">
                    <p className="text-lg">Jugadores listos: {readyPlayers.length} / {connectedPlayers}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Instructions Section */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#083618] p-8 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Cómo Jugar</h2>
            <div className="space-y-6 text-gray-300">
              {/* Descripción del juego */}
              <p className="text-lg">
                <strong>Liar's Poker</strong> es un juego de engaño y estrategia. El objetivo es convencer a tus oponentes de que tienes las mejores cartas, ¡incluso cuando no las tienes!
              </p>

              {/* Reglas Básicas */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Reglas Básicas:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Cada jugador recibe cartas ocultas.</li>
                  <li>¡Observa a tus oponentes y detecta sus mentiras!</li>
                </ul>
              </div>

              {/* Nuevas Reglas de Juego */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Reglas de Juego:</h3>
                <ul className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>
                    <span className="text-white font-semibold">Mesa al Azar:</span> Al comenzar la partida, se elegirá una mesa al azar: <strong>Ases, Reyes</strong> o <strong>Reinas</strong>. Los jugadores deben tirar solo cartas del tipo indicado (A, K o Q).
                  </li>
                  <li>
                    <span className="text-white font-semibold">Mentir:</span> Si no tienes la carta correcta, puedes arriesgarte y mentir sobre lo que tiras. Los demás jugadores pueden sospechar y acusarte de mentir.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Desafíos:</span> Si te acusan de mentir y es cierto, deberás apuntar el revólver a tu cabeza y disparar. Si la bala está en tu espacio, serás eliminado.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Objetivo:</span> El último jugador que quede vivo gana la partida.
                  </li>
                </ul>
              </div>

              {/* Reglas Clave */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Reglas Clave:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Puedes tirar de 1 a 3 cartas en tu turno.</li>
                  <li>Si logras engañar, el juego continúa. Si fallas, el riesgo de eliminación es alto.</li>
                </ul>
              </div>

              {/* Frase final */}
              <p className="text-sm text-gray-400 mt-6 italic">
                "No se trata de las cartas que tienes, sino de las cartas que piensan que tienes."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}