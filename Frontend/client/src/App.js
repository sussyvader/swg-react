// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RoomPage from './RoomPage';
import ResultPage from './ResultPage';

function App() {
  const [roomCode, setRoomCode] = useState('');
  const [result, setResult] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setRoomCode={setRoomCode} />} />
        <Route path="/room/:roomCode" element={<RoomPage roomCode={roomCode} setResult={setResult} />} />
        <Route path="/result" element={<ResultPage result={result} />} />
      </Routes>
    </Router>
  );
}

export default App;
