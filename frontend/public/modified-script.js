// REPLACE YOUR EXISTING SCRIPT.JS WITH THIS MODIFIED VERSION
// This includes tournament integration

let move_speed = 3, gravity = 0.5;

let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// ===== TOURNAMENT INTEGRATION START =====

// Environment detection
function getEnvironment() {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168');
    const isProduction = hostname.includes('boostnow.in');
    
    return {
        isLocal,
        isProduction,
        hostname,
        // API URL based on environment
        getApiUrl: () => {
            if (isLocal) {
                return 'http://localhost:5000/api';
            } else {
                return 'https://ful2winreact.onrender.com/api';
            }
        }
    };
}

// Get tournament parameters from URL
function getTournamentParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const env = getEnvironment();
    
    return {
        tournamentId: urlParams.get('tournament_id'),
        playerId: urlParams.get('player_id'),
        playerName: urlParams.get('player_name'),
        apiUrl: urlParams.get('api_url') || env.getApiUrl(),
        authToken: urlParams.get('auth_token'),
        isTournament: urlParams.get('tournament_id') !== null,
        env
    };
}

// Submit score to tournament API
async function submitTournamentScore(score) {
    const params = getTournamentParams();
    
    if (!params.isTournament) {
        console.log('Not in tournament mode, score not submitted');
        return;
    }

    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add auth token if available
        if (params.authToken) {
            headers['Authorization'] = `Bearer ${params.authToken}`;
        }        // Handle both local and production API URLs
        let apiUrl = params.apiUrl;
        
        // Fallback API URL detection if not provided
        if (!apiUrl) {
            apiUrl = params.env.getApiUrl();
        }

        console.log(`Submitting score to: ${apiUrl}/tournaments/${params.tournamentId}/score`);
        console.log('Environment:', params.env.hostname, 'API URL:', apiUrl);

        const response = await fetch(`${apiUrl}/tournaments/${params.tournamentId}/score`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                score: score
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
                        success: true,
                        result: result
                    }
                }, '*');
            }
            
            return true;
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
        
        return false;
    }
}

// Show tournament info in game UI
function showTournamentInfo() {
    const params = getTournamentParams();
    
    if (!params.isTournament) return;
    
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
    tournamentBanner.innerHTML = `🏆 Tournament Mode - ${params.playerName || 'Player'}`;
    
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

// ===== TOURNAMENT INTEGRATION END =====

// Start game on Enter key or first touch
function startGame() {
    if (game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGame();
});

document.addEventListener('touchstart', startGame, { once: true });

function play() {
    let bird_dy = 0;
    let jump = () => {
        img.src = 'images/Sports-Ball.png';
        bird_dy = -7.6;
    };

    // Replace key controls with touch
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') jump();
    });

    document.addEventListener('touchstart', jump);

    function move() {
        if (game_state !== 'Play') return;

        let pipes = document.querySelectorAll('.pipe_sprite');
        pipes.forEach((pipe) => {
            let pipe_rect = pipe.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_rect.right <= 0) {
                pipe.remove();
            } else {
                // Collision detection
                if (
                    bird_props.left < pipe_rect.left + pipe_rect.width &&
                    bird_props.left + bird_props.width > pipe_rect.left &&
                    bird_props.top < pipe_rect.top + pipe_rect.height &&
                    bird_props.top + bird_props.height > pipe_rect.top
                ) {
                    // MODIFIED: Call handleGameOver instead of direct game over
                    handleGameOver(parseInt(score_val.innerHTML));
                    return;
                } else {
                    if (
                        pipe_rect.right < bird_props.left &&
                        pipe_rect.right + move_speed >= bird_props.left &&
                        pipe.increase_score === '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                        pipe.increase_score = '0';
                    }
                    pipe.style.left = pipe_rect.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
        if (game_state !== 'Play') return;

        bird_dy += gravity;
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            // MODIFIED: Call handleGameOver instead of direct game over
            handleGameOver(parseInt(score_val.innerHTML));
            return;
        }

        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_posi - 70 + 'vh';
            pipe_top.style.left = '100vw';

            document.body.appendChild(pipe_top);

            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';

            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(create_pipe);
}

// MODIFIED: New handleGameOver function with tournament integration
async function handleGameOver(finalScore) {
    game_state = 'End';
    img.style.display = 'none';
    sound_die.play();
    
    const params = getTournamentParams();
    
    // Submit score if in tournament mode
    if (params.isTournament) {
        message.innerHTML = `
            <div style="color: #4ecdc4; font-size: 18px; margin-bottom: 10px;">
                🏆 Tournament Score: ${finalScore}
            </div>
            <div style="color: white; font-size: 14px; margin-bottom: 15px;">
                Submitting score...
            </div>
        `;
        message.classList.add('messageStyle');
        
        const success = await submitTournamentScore(finalScore);
        
        if (success) {
            message.innerHTML = `
                <div style="color: #4ecdc4; font-size: 18px; margin-bottom: 10px;">
                    🏆 Tournament Score: ${finalScore}
                </div>
                <div style="color: #4ecdc4; font-size: 14px; margin-bottom: 15px;">
                    ✅ Score submitted successfully!
                </div>
                <div style="color: #ff6b6b;">
                    Game Over<br>Tap to Play Again
                </div>
            `;
        } else {
            message.innerHTML = `
                <div style="color: #4ecdc4; font-size: 18px; margin-bottom: 10px;">
                    🏆 Tournament Score: ${finalScore}
                </div>
                <div style="color: #ff6b6b; font-size: 14px; margin-bottom: 15px;">
                    ❌ Failed to submit score
                </div>
                <div style="color: #ff6b6b;">
                    Game Over<br>Tap to Play Again
                </div>
            `;
        }
    } else {
        // Regular game over message
        message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Tap to Restart';
        message.classList.add('messageStyle');
    }
    
    // Allow restart
    setTimeout(() => {
        document.addEventListener('touchstart', restartGame, { once: true });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') restartGame();
        }, { once: true });
    }, 1000);
}

function restartGame() {
    window.location.reload();
}

// Initialize tournament mode when page loads
document.addEventListener('DOMContentLoaded', function() {
    showTournamentInfo();
    
    // Listen for messages from parent window
    window.addEventListener('message', function(event) {
        if (event.data.type === 'RESTART_GAME') {
            restartGame();
        }
    });
});
