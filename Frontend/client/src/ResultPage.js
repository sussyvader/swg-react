import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './ResultPage.css';

const ResultPage = ({ myScore, opponentScore, winner }) => {
    const navigate = useNavigate(); // Create a navigate function

    const handleBackToHome = () => {
        navigate('/'); // Navigate back to the home screen
    };

    return (
        <div className="result-page">
            <div className="result-container">
                <h1 className="result-title">Game Over</h1>
                <div className="scoreboard">
                    <div className="score">
                        <h2 className="player-title">Your Score</h2>
                        <img src={`/${myScore}.png`} alt="Your Score" className="score-image" />
                    </div>
                    <div className="score">
                        <h2 className="player-title">Opponent Score</h2>
                        <img src={`/${opponentScore}.png`} alt="Opponent Score" className="score-image" />
                    </div>
                </div>
                <div className="winner-message">
                    {winner ? (
                        <h2 className="winner-title">Congratulations! You Win!</h2>
                    ) : (
                        <h2 className="winner-title">Sorry, You Lost!</h2>
                    )}
                </div>
                <button className="restart-button" onClick={() => window.location.reload()}>
                    Play Again
                </button>
                <button className="home-button" onClick={handleBackToHome}>
                    Back to Home Screen
                </button>
            </div>
        </div>
    );
};

export default ResultPage;
