import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Club, Heart, Diamond, Spade } from 'lucide-react';

const icons = [
  { component: Club, color: 'text-red-500' },
  { component: Heart, color: 'text-red-500' },
  { component: Diamond, color: 'text-red-500' },
  { component: Spade, color: 'text-red-500' },
];

const IconSwitcher = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 1000); // Cambia cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[currentIndex].component;
  const currentColor = icons[currentIndex].color;

  return (
    <div className="flex items-center justify-center gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <CurrentIcon className={`w-8 h-8 ${currentColor}`} />
        </motion.div>
      </AnimatePresence>
      <h1 className="text-2xl font-bold text-white">Liar's Poker</h1>
    </div>
  );
};

export default IconSwitcher;
