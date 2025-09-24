const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color="#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color="#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size=32) {
    ctx.fillStyle = "#fff";
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

// Input: mouse controls player paddle
canvas.addEventListener("mousemove", function(e) {
    // Get mouse Y relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Collision detection
function collide(ballX, ballY, paddleX, paddleY) {
    return (
        ballX < paddleX + PADDLE_WIDTH &&
        ballX + BALL_SIZE > paddleX &&
        ballY < paddleY + PADDLE_HEIGHT &&
        ballY + BALL_SIZE > paddleY
    );
}

// Game update
function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Collision with top/bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVelY *= -1;
    }

    // Collision with player paddle
    if (collide(ballX, ballY, PLAYER_X, playerY)) {
        ballX = PLAYER_X + PADDLE_WIDTH; // Prevent sticking
        ballVelX *= -1;
        // Add some "spin" based on contact
        let hitPoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballVelY = hitPoint * 0.25;
    }

    // Collision with AI paddle
    if (collide(ballX, ballY, AI_X, aiY)) {
        ballX = AI_X - BALL_SIZE; // Prevent sticking
        ballVelX *= -1;
        let hitPoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballVelY = hitPoint * 0.25;
    }

    // Score update
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Move AI paddle (simple AI: track the ball)
    if (aiY + PADDLE_HEIGHT / 2 < ballY + BALL_SIZE / 2) {
        aiY += PADDLE_SPEED;
    } else if (aiY + PADDLE_HEIGHT / 2 > ballY + BALL_SIZE / 2) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Reset ball after score
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Render
function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#222");
    // Net (dashed center line)
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 2, i, 4, 10, "#444");
    }
    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    // Ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, "#fff");
    // Score
    drawText(playerScore, canvas.width / 4, 50, 36);
    drawText(aiScore, canvas.width * 3 / 4, 50, 36);
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start
gameLoop();
