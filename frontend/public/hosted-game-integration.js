// Tournament Integration for Hosted FlappyBall Game
// Add this code to your hosted game's script.js file

// Get tournament parameters from URL
function getTournamentParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        tournamentId: urlParams.get('tournament_id'),
        playerId: urlParams.get('player_id'),
        playerName: urlParams.get('player_name'),
        apiUrl: urlParams.get('api_url') || 'http://localhost:5000/api',
        isTournament: urlParams.get('tournament_id') !== null
    };
}

// Submit score to tournament API
async function submitTournamentScore(score) {
    const params = getTournamentParams();
    
    if (!params.isSuperset) {
        console.log('Not in tournament mode, score not submitted');
        return;
    }

    try {
        const response = await fetch(`${params.apiUrl}/tournaments/${params.tournamentId}/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${params.playerId}` // You might need to adjust this
            },
            body: JSON.stringify({
                score: score,
                playerId: params.playerId,
                playerName: params.playerName
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Tournament score submitted successfully:', result);
            
            // Notify parent window (React app) about score submission
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                    type: 'TOURNAMENT_SCORE_SUBMITTED',
                    data: {
                        score: score,
                        tournamentId: params.tournamentId,
                        success: true
                    }
                }, '*');
            }
        } else {
            throw new Error(result.message || 'Failed to submit score');
        }
    } catch (error) {
        console.error('Error submitting tournament score:', error);
        
        // Notify parent window about error
        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({
                type: 'TOURNAMENT_SCORE_ERROR',
                data: {
                    error: error.message,
                    tournamentId: params.tournamentId
                }
            }, '*');
        }
    }
}

// Show tournament info in game UI
function showTournamentInfo() {
    const params = getTournamentParams();
    
    if (!params.isSuperset) return;
    
    // Add tournament banner to game
    const tournamentBanner = document.createElement('div');
    tournamentBanner.id = 'tournament-banner';
    tournamentBanner.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
    `;
    tournamentBanner.innerHTML = `🏆 Tournament Mode - Player: ${params.playerName || 'Unknown'}`;
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
            100% { transform: translateX(-50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(tournamentBanner);
}

// Modify your existing game over function
function handleGameOver(finalScore) {
    const params = getTournamentParams();
    
    // Submit score if in tournament mode
    if (params.isSuperset) {
        submitTournamentScore(finalScore);
        
        // Update game over message for tournament
        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = `
                <div style="color: #4ecdc4; font-size: 18px; margin-bottom: 10px;">
                    🏆 Tournament Score: ${finalScore}
                </div>
                <div style="color: white; font-size: 14px; margin-bottom: 15px;">
                    Score submitted to tournament!
                </div>
                <div style="color: #ff6b6b;">
                    Game Over<br>Tap to Play Again
                </div>
            `;
        }
    } else {
        // Regular game over message
        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Tap to Restart';
        }
    }
}

// Initialize tournament mode when page loads
document.addEventListener('DOMContentLoaded', function() {
    showTournamentInfo();
    
    // Listen for messages from parent window
    window.addEventListener('message', function(event) {
        if (event.data.type === 'RESTART_GAME') {
            // Restart the game
            window.location.reload();
        }
    });
});

// Override the original game over logic
// You'll need to modify your existing script.js to call handleGameOver(score) instead of the original game over logic
