const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const startBtn = document.getElementById("startBtn");
const scoreBoard = document.getElementById("scoreBoard");
const lastScoreDisplay = document.getElementById("lastScore");
const bestScoreDisplay = document.getElementById("bestScore");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Bird properties
let bird;
let pipes = [];
let clouds = [];
let frame, score, gameOver, awaitingStart, level;
let bestScore = localStorage.getItem("bestScore") || 0;

function initGame() {
  bird = {
    x: canvas.width / 6,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
    lift: -8
  };
  pipes = [];
  clouds = [];
  frame = 0;
  score = 0;
  level = 1;
  gameOver = false;
  awaitingStart = true;
  scoreDisplay.textContent = 0;
  levelDisplay.textContent = "Level 1";
}

// Draw Bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(bird.x + bird.radius * 0.6, bird.y - 8, bird.radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x + bird.radius * 0.6, bird.y - 8, bird.radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.radius, bird.y);
  ctx.lineTo(bird.x + bird.radius + 15, bird.y - 5);
  ctx.lineTo(bird.x + bird.radius + 15, bird.y + 5);
  ctx.closePath();
  ctx.fill();
}

// Pipes
function drawPipes() {
  ctx.fillStyle = "#2ecc71";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    let gap = Math.max(150 - level * 10, 90); // smaller gap per level
    let top = Math.random() * (canvas.height / 2);
    let bottom = top + gap;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: bottom,
      speed: 3 + level // faster pipes per level
    });
  }

  pipes.forEach(pipe => {
    pipe.x -= pipe.speed;

    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipe.width &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
    ) {
      gameOver = true;
    }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      scoreDisplay.textContent = score;

      // Level up every 10 points
      if (score % 10 === 0) {
        level++;
        levelDisplay.textContent = "Level " + level;
      }
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Clouds
function updateClouds() {
  if (frame % 150 === 0) {
    clouds.push({
      x: canvas.width,
      y: Math.random() * (canvas.height / 3),
      radius: 40 + Math.random() * 30,
      speed: 1 + Math.random()
    });
  }
  clouds.forEach(cloud => (cloud.x -= cloud.speed));
  clouds = clouds.filter(cloud => cloud.x + cloud.radius > 0);
}

function drawClouds() {
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  clouds.forEach(cloud => {
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.radius * 0.6, cloud.y + 10, cloud.radius * 0.7, 0, Math.PI * 2);
    ctx.arc(cloud.x - cloud.radius * 0.6, cloud.y + 10, cloud.radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Bird physics
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.radius > canvas.height) {
    bird.y = canvas.height - bird.radius;
    gameOver = true;
  }
  if (bird.y - bird.radius < 0) {
    bird.y = bird.radius;
    bird.velocity = 0;
  }
}

// Main loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  drawBird();
  drawPipes();
}

function update() {
  if (gameOver) {
    endGame();
    return;
  }
  updateBird();
  updatePipes();
  updateClouds();
  draw();
  frame++;
  requestAnimationFrame(update);
}

// Game over
function endGame() {
  lastScoreDisplay.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  bestScoreDisplay.textContent = bestScore;

  awaitingStart = true;

  // Draw Game Over immediately
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  // Hide scoreboard & button first
  scoreBoard.classList.add("hidden");
  startBtn.classList.add("hidden");

  // After 3 seconds → show scoreboard and button
  setTimeout(() => {
    scoreBoard.classList.remove("hidden");
    scoreBoard.classList.add("fade-in");
    setTimeout(() => scoreBoard.classList.add("show"), 50); // trigger fade-in

    startBtn.classList.remove("hidden");
  }, 800);
}

// Start & reset
function startGame() {
  scoreBoard.classList.add("hidden");
  startBtn.classList.add("hidden");
  initGame();
  awaitingStart = false;
  update();
}

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    if (awaitingStart || gameOver) {
      startGame();
    } else {
      bird.velocity = bird.lift;
    }
  }
});
document.addEventListener("touchstart", () => {
  if (awaitingStart || gameOver) {
    startGame();
  } else {
    bird.velocity = bird.lift;
  }
});
startBtn.addEventListener("click", startGame);

initGame();
