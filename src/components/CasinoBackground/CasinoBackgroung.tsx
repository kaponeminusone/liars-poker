'use client'

import React, { useEffect, useState } from 'react'
import Board from '../Board'

interface PokerChip {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

interface FloatingCard {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
}

export default function CasinoCardGame() {
  const [chips, setChips] = useState<PokerChip[]>([])
  const [cards, setCards] = useState<FloatingCard[]>([])

  const chipColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-black',
    'bg-white'
  ]

  useEffect(() => {
    const initialChips = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: chipColors[Math.floor(Math.random() * chipColors.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    }))

    const initialCards = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5
    }))

    setChips(initialChips)
    setCards(initialCards)

    const interval = setInterval(() => {
      setChips(prevChips =>
        prevChips.map(chip => ({
          ...chip,
          x: (chip.x + 0.1) % 100,
          y: (chip.y + 0.05) % 100,
          rotation: (chip.rotation + 0.5) % 360
        }))
      )

      setCards(prevCards =>
        prevCards.map(card => ({
          ...card,
          x: (card.x + 0.08) % 100,
          y: (card.y + 0.04) % 100,
          rotation: (card.rotation + 0.3) % 360
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-green-800 to-green-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 to-transparent"></div>
        <div className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E')] opacity-20"></div>
      </div>

      {/* Floating poker chips */}
      {chips.map(chip => (
        <div
          key={chip.id}
          className={`absolute rounded-full ${chip.color} shadow-lg`}
          style={{
            left: `${chip.x}%`,
            top: `${chip.y}%`,
            width: '40px',
            height: '40px',
            transform: `rotate(${chip.rotation}deg) scale(${chip.scale})`,
            transition: 'all 0.5s linear',
            border: '2px solid rgba(255,255,255,0.2)',
            opacity: 0.3
          }}
        >
          <div className="absolute inset-2 rounded-full border-2 border-white/30"></div>
        </div>
      ))}

      {/* Floating cards */}
      {cards.map(card => (
        <div
          key={card.id}
          className="absolute bg-white rounded-lg shadow-lg"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            width: '60px',
            height: '84px',
            transform: `rotate(${card.rotation}deg) scale(${card.scale})`,
            transition: 'all 0.5s linear',
            opacity: 0.1
          }}
        >
          <div className="absolute inset-1 border border-gray-300 rounded-md"></div>
        </div>
      ))}

      {/* Board component */}
      <div className="relative z-10">
        <Board />
      </div>
    </div>
  )
}