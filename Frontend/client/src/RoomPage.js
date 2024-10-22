import React, { useEffect, useState } from 'react';
import './RoomPage.css';

const RoomPage = ({ roomCode }) => {
    const [myChoice, setMyChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(null);
    const [myScore, setMyScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket(`ws://localhost:8080`);
        setWs(websocket);

        websocket.onopen = () => {
            console.log('Connected to WebSocket server');
            // Join the room
            websocket.send(JSON.stringify({ type: 'join', roomCode }));
        };

        websocket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'opponentChoice') {
                setOpponentChoice(data.choice);
                // Implement logic to update scores based on choices
                // This is a placeholder for your score logic
                if (myChoice && opponentChoice) {
                    // Example score calculation logic
                    if ((myChoice === 'snake' && opponentChoice === 'water') ||
                        (myChoice === 'water' && opponentChoice === 'gun') ||
                        (myChoice === 'gun' && opponentChoice === 'snake')) {
                        setMyScore(prevScore => Math.min(prevScore + 1, 3)); // Increase score, max 3
                    } else if ((opponentChoice === 'snake' && myChoice === 'water') ||
                               (opponentChoice === 'water' && myChoice === 'gun') ||
                               (opponentChoice === 'gun' && myChoice === 'snake')) {
                        setOpponentScore(prevScore => Math.min(prevScore + 1, 3)); // Increase score, max 3
                    }
                }
            }
        };

        websocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            websocket.close();
        };
    }, [roomCode, myChoice, opponentChoice]);

    const handleChoice = (choice) => {
        setMyChoice(choice);
        ws.send(JSON.stringify({ type: 'myChoice', choice }));
    };

    const getScoreImage = (score) => {
        if (score === 0) {
            return '/dash.png'; // Initial score
        }
        return `/${score}.png`; // 1, 2, 3 scores
    };

    return (
        <div className="room-page">
            <h1>Room Code: {roomCode}</h1>
            <div className="scoreboard">
                <img src={getScoreImage(myScore)} alt="My Score" className="score-image left" /> {/* My Score */}
                <img src={getScoreImage(opponentScore)} alt="Opponent Score" className="score-image right" /> {/* Opponent Score */}
            </div>
            <div className="results">
                <div className="my-choice">
                    {myChoice && (
                        <img
                            src={`/${myChoice}.png`} // Assuming images are named snake.png, water.png, gun.png
                            alt={myChoice}
                            className="choice-image my-image"
                        />
                    )}
                </div>
                <div className="opponent-choice">
                    {opponentChoice && (
                        <img
                            src={`/${opponentChoice}.png`} // Assuming images are named snake.png, water.png, gun.png
                            alt={opponentChoice}
                            className="choice-image opponent-image"
                        />
                    )}
                </div>
            </div>
            <div className="choices">
                <div className="button-group">
                    <img
                        src="/snake.png" // Path to the Snake image
                        alt="Snake"
                        className="choice-button"
                        onClick={() => handleChoice('snake')}
                    />
                    <img
                        src="/water.png" // Path to the Water image
                        alt="Water"
                        className="choice-button"
                        onClick={() => handleChoice('water')}
                    />
                    <img
                        src="/gun.png" // Path to the Gun image
                        alt="Gun"
                        className="choice-button"
                        onClick={() => handleChoice('gun')}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoomPage;
