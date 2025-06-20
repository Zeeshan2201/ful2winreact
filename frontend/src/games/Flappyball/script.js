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
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Tap to Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
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
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload(); // reload for restart
            message.classList.remove('messageStyle');
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