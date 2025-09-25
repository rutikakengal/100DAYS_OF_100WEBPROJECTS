// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
let score = 0;
let highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;

// Bird image
const birdImage = new Image();
birdImage.src = 'img/bird.png'; // Make sure you have a bird.png file in the img/ directory
let imageLoaded = false;

birdImage.onload = function() {
    imageLoaded = true;
};

// Game objects
const bird = {
    x: 80,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    velocityY: 0,
    gravity: 0.3,
    jumpStrength: -5.5,
    wingUp: false
};

// Load sounds
const bgMusic = new Audio("sounds/background.mp3");
const gameOverSound = new Audio("sounds/gameover.wav");
const jumpSound = new Audio("sounds/jump.wav");

// Background music should loop
bgMusic.loop = true;
bgMusic.volume = 0.5; // adjust volume (0.0 - 1.0)


const pipes = [];
const pipeWidth = 60;
const pipeGap = 160;
let pipeTimer = 0;
const pipeInterval = 120; // frames between pipes (increased for easier gameplay)

// Game settings
const gameSpeed = 1.5;

// DOM elements
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameHUD = document.getElementById('gameHUD');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const highScoreElement = document.getElementById('highScore');
const restartBtn = document.getElementById('restartBtn');
const pauseText = document.getElementById('pauseText');
const pauseBtn = document.getElementById('pauseBtn');

// Initialize game
function init() {
    updateHighScore();
    gameLoop();
    setupEventListeners();
}

// Event listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            handleInput();
            jumpSound.currentTime = 0; // rewind so it can play repeatedly
            jumpSound.play();
        } else if (e.code === 'KeyP') {
            togglePause();
        }
    });

    // Mouse controls
    canvas.addEventListener('click', handleInput);

    // Touch controls
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput();
    });

    // Restart button
    restartBtn.addEventListener('click', restartGame);

    // Pause button
    pauseBtn.addEventListener('click', togglePause);
}

function handleInput() {
    switch (gameState) {
        case 'start':
            startGame();
            break;
        case 'playing':
            birdFlap();
            break;
        case 'gameOver':
            restartGame();
            break;
    }
}

function startGame() {
    gameState = 'playing';
    bgMusic.play();
    startScreen.classList.add('hidden');
    gameHUD.classList.remove('hidden');
    resetBird();
    pipes.length = 0;
    score = 0;
    pipeTimer = 0;
    updateScore();
}

function restartGame() {
    gameState = 'playing';
    bgMusic.play();
    gameOverScreen.classList.add('hidden');
    gameHUD.classList.remove('hidden');
    resetBird();
    pipes.length = 0;
    score = 0;
    pipeTimer = 0;
    updateScore();
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        pauseText.classList.remove('hidden');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        pauseText.classList.add('hidden');
    }
}

function resetBird() {
    bird.x = 80;
    bird.y = canvas.height / 2;
    bird.velocityY = 0;
    bird.wingUp = false;
}

function birdFlap() {
    bird.velocityY = bird.jumpStrength;
    bird.wingUp = true;
    setTimeout(() => bird.wingUp = false, 100);
}

function updateBird() {
    if (gameState !== 'playing') return;

    // Apply gravity
    bird.velocityY += bird.gravity;
    bird.y += bird.velocityY;

    // Check boundaries
    if (bird.y + bird.height > canvas.height - 50) { // Ground collision
        gameOver();
    }
    if (bird.y < 0) { // Ceiling collision
        gameOver();
    }
}

function createPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 150) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + pipeGap,
        bottomHeight: canvas.height - (topHeight + pipeGap) - 50,
        width: pipeWidth,
        passed: false
    });
}

function updatePipes() {
    if (gameState !== 'playing') return;

    // Create new pipes
    pipeTimer++;
    if (pipeTimer >= pipeInterval) {
        createPipe();
        pipeTimer = 0;
    }

    // Update pipe positions
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= gameSpeed;

        // Check for scoring
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
            updateScore();
        }

        // Remove off-screen pipes
        if (pipe.x + pipe.width < 0) {
            pipes.splice(i, 1);
        }

        // Collision detection
        if (checkCollision(bird, pipe)) {
            gameOver();
        }
    }
}

function checkCollision(bird, pipe) {
    // Bird boundaries
    const birdLeft = bird.x;
    const birdRight = bird.x + bird.width;
    const birdTop = bird.y;
    const birdBottom = bird.y + bird.height;

    // Pipe boundaries
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipe.width;

    // Check if bird is within pipe x-range
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check collision with top pipe
        if (birdTop < pipe.topHeight) {
            return true;
        }
        // Check collision with bottom pipe
        if (birdBottom > pipe.bottomY) {
            return true;
        }
    }
    return false;
}

function drawBird() {
    ctx.save();
    
    // Bird rotation based on velocity
    const rotation = Math.min(Math.max(bird.velocityY * 0.05, -0.5), 0.5);
    ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
    ctx.rotate(rotation);
    
    if (imageLoaded) {
        // Draw the bird image
        ctx.drawImage(birdImage, -bird.width/2, -bird.height/2, bird.width, bird.height);
    } else {
        // Fallback: draw a simple colored rectangle if image hasn't loaded
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-bird.width/2, -bird.height/2, bird.width, bird.height);
        
        // Bird eye (fallback)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(bird.width/4, -bird.height/4, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(bird.width/4 + 2, -bird.height/4, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawPipes() {
    ctx.fillStyle = '#228B22';
    
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, pipe.bottomHeight);
        
        // Pipe caps
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
        ctx.fillStyle = '#228B22';
    });
}

function drawBackground() {
    // Sky gradient (already in CSS)
    
    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Simple cloud animation
    const cloudOffset = (Date.now() * 0.01) % (canvas.width + 100);
    
    // Cloud 1
    ctx.beginPath();
    ctx.arc(cloudOffset - 50, 100, 20, 0, Math.PI * 2);
    ctx.arc(cloudOffset - 30, 100, 25, 0, Math.PI * 2);
    ctx.arc(cloudOffset - 10, 100, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Cloud 2
    ctx.beginPath();
    ctx.arc(cloudOffset + 200, 180, 15, 0, Math.PI * 2);
    ctx.arc(cloudOffset + 215, 180, 20, 0, Math.PI * 2);
    ctx.arc(cloudOffset + 235, 180, 15, 0, Math.PI * 2);
    ctx.fill();
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore.toString());
    }
}

function updateHighScore() {
    highScoreElement.textContent = highScore;
}

function gameOver() {
    gameState = 'gameOver';
    bgMusic.pause();
    bgMusic.currentTime = 0; // reset to start
    gameOverSound.play();
    gameHUD.classList.add('hidden');
    finalScoreElement.textContent = score;
    updateHighScore();
    gameOverScreen.classList.remove('hidden');
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBackground();
    drawClouds();
    drawPipes();
    drawBird();
}

function gameLoop() {
    updateBird();
    updatePipes();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
init();