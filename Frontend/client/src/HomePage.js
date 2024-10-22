// HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for styling

function HomePage({ setRoomCode }) {
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [inputRoomCode, setInputRoomCode] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send(JSON.stringify({ type: 'create-room' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'room-created') {
        const newRoomCode = data.roomCode;
        setRoomCode(newRoomCode);
        navigate(`/room/${newRoomCode}`);
        socket.close();
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };
  };

  const handleJoinRoom = () => {
    if (inputRoomCode.trim()) {
      setRoomCode(inputRoomCode);
      navigate(`/room/${inputRoomCode}`);
    } else {
      alert('Please enter a valid room code.');
    }
  };

  return (
    <div className="homepage">
      <div className="container">
        <h1>Snake Water Gun Game</h1>
        <div className="buttons">
          <button className="btn create" onClick={handleCreateRoom}>Create Room</button>
          <button className="btn join" onClick={() => setShowJoinRoom(true)}>Join Room</button>
        </div>
        {showJoinRoom && (
          <div className="join-room">
            <input
              type="text"
              placeholder="Enter room code"
              value={inputRoomCode}
              onChange={(e) => setInputRoomCode(e.target.value)}
            />
            <button className="btn join" onClick={handleJoinRoom}>Enter Room</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
