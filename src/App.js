import React from 'react';
import './App.css';
import Maze from './components/maze';
import Timer from './components/timer'

function App() {
  return (
    <div className="App">
      <Maze />
      <Timer />
    </div>
  );
}

export default App;
