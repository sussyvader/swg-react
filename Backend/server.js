const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Store rooms and players
let rooms = {}; // key: room code, value: { players: [ws1, ws2], scores: [0, 0] }

// Function to generate a random room code
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Handle new client connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.log('Invalid message:', message);
            return;
        }

        if (data.type === 'create-room') {
            const roomCode = generateRoomCode();
            rooms[roomCode] = { players: [ws], scores: [0, 0] };
            ws.roomCode = roomCode;
            ws.playerIndex = 0; // First player
            ws.send(JSON.stringify({ type: 'room-created', roomCode }));
        }

        if (data.type === 'join-room') {
            const roomCode = data.roomCode;
            if (rooms[roomCode] && rooms[roomCode].players.length === 1) {
                rooms[roomCode].players.push(ws);
                ws.roomCode = roomCode;
                ws.playerIndex = 1; // Second player
                rooms[roomCode].players[0].send(JSON.stringify({ type: 'opponent-joined' }));
                ws.send(JSON.stringify({ type: 'joined-room', roomCode }));
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid room code or room full' }));
            }
        }

        if (data.type === 'make-move') {
            const roomCode = ws.roomCode;
            if (!roomCode || !rooms[roomCode]) return;

            const move = data.move;
            ws.currentMove = move;

            const players = rooms[roomCode].players;
            if (players[0].currentMove && players[1] && players[1].currentMove) {
                // Both players have made their moves, determine the winner
                const winner = determineWinner(players[0].currentMove, players[1].currentMove);
                if (winner !== 'draw') {
                    rooms[roomCode].scores[winner]++;
                }

                // Send results to both players
                players.forEach((player, index) => {
                    player.send(JSON.stringify({
                        type: 'round-result',
                        yourMove: player.currentMove,
                        opponentMove: players[1 - index].currentMove,
                        winner,
                        scores: rooms[roomCode].scores,
                    }));
                });

                // Reset moves for the next round
                players[0].currentMove = null;
                players[1].currentMove = null;

                // Check for game winner (first to 3)
                const [score1, score2] = rooms[roomCode].scores;
                if (score1 === 3 || score2 === 3) {
                    const gameWinner = score1 === 3 ? 0 : 1;
                    players.forEach((player, index) => {
                        player.send(JSON.stringify({
                            type: 'game-over',
                            winner: gameWinner,
                        }));
                    });

                    // Close the WebSocket connections
                    players.forEach(player => player.close());
                    delete rooms[roomCode]; // Delete the room
                }
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const roomCode = ws.roomCode;
        if (roomCode && rooms[roomCode]) {
            // Inform the other player that the game has ended due to disconnect
            rooms[roomCode].players.forEach(player => {
                if (player !== ws) {
                    player.send(JSON.stringify({ type: 'opponent-disconnected' }));
                    player.close();
                }
            });
            delete rooms[roomCode];
        }
    });
});

// Function to determine the winner of a round
// Returns 0 for player 1 win, 1 for player 2 win, or 'draw' for a tie
function determineWinner(move1, move2) {
    const outcomes = {
        snake: { gun: 0, water: 1 },
        water: { snake: 0, gun: 1 },
        gun: { snake: 1, water: 0 },
    };

    if (move1 === move2) return 'draw';
    return outcomes[move1][move2];
}

console.log('WebSocket server is running on ws://localhost:8080');
