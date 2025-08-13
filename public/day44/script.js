const canvas = document.getElementById('flappyBird');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const welcomeScreen = document.getElementById('welcomeScreen');

let canvasWidth = 360;
let canvasHeight = 640;
canvas.width = canvasWidth;
canvas.height = canvasHeight;


const birdImage = new Image();
birdImage.src = 'bird.jpg'; 

const gravity = 0.5;
const flap = -8;
const pipeGap = 150;
const pipeWidth = 60;


let bird, pipes, score, gameOver, frames;

function initGame() {
  bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 30,
    velocity: 0
  };

  pipes = [];
  score = 0;
  gameOver = false;
  frames = 0;
}

function drawBird() {
  ctx.drawImage(birdImage, bird.x - bird.width / 2, bird.y - bird.height / 2, bird.width, bird.height);
}

function drawPipe(pipe) {
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
  ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvasHeight - pipe.top - pipeGap);
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (frames % 90 === 0) {
    let pipeTop = Math.floor(Math.random() * (canvasHeight - pipeGap - 100)) + 50;
    pipes.push({ x: canvasWidth, top: pipeTop });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
    drawPipe(pipe);

    if (
      bird.x + bird.width / 2 > pipe.x &&
      bird.x - bird.width / 2 < pipe.x + pipeWidth &&
      (bird.y - bird.height / 2 < pipe.top ||
        bird.y + bird.height / 2 > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }

    if (pipe.x + pipeWidth === bird.x) {
      score++;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  drawBird();
  drawScore();

  if (bird.y + bird.height / 2 >= canvasHeight || bird.y - bird.height / 2 <= 0) {
    gameOver = true;
  }

  if (!gameOver) {
    frames++;
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = '#000';
    ctx.font = '32px Arial';
    ctx.fillText('Game Over', canvasWidth / 2 - 80, canvasHeight / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Tap to Restart', canvasWidth / 2 - 70, canvasHeight / 2 + 30);
  }
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    bird.velocity = flap;
    if (gameOver) {
      initGame();
      gameLoop();
    }
  }
});

document.addEventListener('touchstart', () => {
  bird.velocity = flap;
  if (gameOver) {
    initGame();
    gameLoop();
  }
});


startBtn.addEventListener('click', () => {
  birdImage.onload = () => {
    welcomeScreen.style.display = 'none';
    canvas.style.display = 'block';
    initGame();
    gameLoop();
  };

  if (birdImage.complete) {
    welcomeScreen.style.display = 'none';
    canvas.style.display = 'block';
    initGame();
    gameLoop();
  }
});
