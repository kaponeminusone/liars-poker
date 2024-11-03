import React from 'react';

interface TurnIndicatorProps {
  direction: 'top' | 'right' | 'bottom' | 'left';
  playerName?: string;
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({ direction, playerName }) => {
  const getRotation = () => {
    switch (direction) {
      case 'right': return 'rotate-90';
      case 'bottom': return 'rotate-180';
      case 'left': return '-rotate-90';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-20">
      <div className={`relative w-40 h-40 transition-transform duration-500 ${getRotation()}`}>
        {/* Outer glow effect */}
        {/* <div className="absolute inset-0 rounded-full blur-[2px] bg-white/50" /> */}
        
        {/* Main circle with border */}
        <div className="absolute inset-[2px] rounded-full bg-white border-2 border-gray-200/80">
          {/* Text content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center -rotate-180">
              <p className="text-gray-400 text-sm">TURNO DE</p>
              <p className="text-gray-600 font-bold">{playerName || 'Jugador'}</p>
            </div>
          </div>
        </div>

        {/* Pointer shape using pseudo-element */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div
            className="w-8 h-8 bg-transparent border-t-8 border-l-8 border-r-8 border-transparent border-gray-200 "
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'scale(1.2)',
              backgroundColor: '#FFFFFF',
              borderTopColor: '#e5e7eb' // Optional: Matching the circle border color
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TurnIndicator;