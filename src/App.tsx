// src/App.tsx

import React from 'react';
import Board from './components/Board';
import CasinoCardGame from './components/CasinoBackground/CasinoBackgroung';

const App: React.FC = () => {
  return (
    <div className="App h-[100vh]">
      {/* <Board /> */}
      <CasinoCardGame></CasinoCardGame>
    </div>
  );
};

export default App;
