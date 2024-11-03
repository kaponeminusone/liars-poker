import React from "react";

interface RevolverCylinderProps {
  usedBullets: number;
  className?: string;
  size?: number; // Nuevo: tamaño del componente
}

export default function RevolverCylinder({ usedBullets, className, size = 128 }: RevolverCylinderProps) {
  const totalChambers = 6;
  const clampedUsedBullets = Math.max(0, Math.min(usedBullets, totalChambers));

  return (
    <div
      className={`relative transform transition-transform duration-300 hover:scale-105 ${className || ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      role="img"
      aria-label={`Revolver cylinder with ${clampedUsedBullets} of ${totalChambers} chambers used`}
    >
      {/* Base cylinder */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform rotate-0 transition-transform duration-500"
      >
        {/* Outer circle */}
        <path
          d="M50 10 A40 40 0 1 1 49.999 10 Z"
          className="fill-zinc-900"
        />
        
        {/* Center hole */}
        <circle
          cx="50"
          cy="50"
          r="8"
          className="fill-zinc-800"
        />
      </svg>

      {/* Chambers */}
      {Array.from({ length: totalChambers }).map((_, index) => {
        const angle = (index * 60 + 90) * (Math.PI / 180); // Start from top and go counter-clockwise
        const x = 50 + Math.cos(angle) * 25;
        const y = 50 + Math.sin(angle) * 25;
        const isUsed = index < clampedUsedBullets;

        return (
          <div
            key={index}
            className={`absolute rounded-full transition-all duration-300 ${
              isUsed ? "bg-red-600" : "bg-zinc-800"
            }`}
            style={{
              width: `${size * 0.18}px`, // Escalar tamaño de la cámara
              height: `${size * 0.18}px`,
              left: `${(x / 100) * 100}%`,
              top: `${(y / 100) * 100}%`,
              marginTop: `-${size * 0.09}px`,
              marginLeft: `-${size * 0.09}px`,
            }}
          >
            <div
              className={`absolute inset-1 rounded-full transition-all duration-300 border border-zinc-700 ${
                isUsed ? "bg-red-700" : "bg-zinc-900"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
