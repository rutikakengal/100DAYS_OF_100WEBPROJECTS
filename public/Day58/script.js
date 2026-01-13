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
let stars = [];
let frame, score, gameOver, awaitingStart, level;
let bestScore = localStorage.getItem("bestScore") || 0;

// Wing animation variables
let wingAngle = 0;
let wingDirection = 1;

// Day/Night Cycle Variables
let timeOfDay = 0; 
let weather = "clear";
let weatherChangeFrame = 0;

// Timeout ID for endGame scoreboard delay
let endGameTimeout = null;

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
  stars = [];
  frame = 0;
  score = 0;
  level = 1;
  gameOver = false;
  awaitingStart = true;
  scoreDisplay.textContent = 0;
  levelDisplay.textContent = "Level 1";
  timeOfDay = Math.random();
  weather = "clear";
  weatherChangeFrame = 0;
}

// Background Day/Night Gradient + Weather
function drawBackground() {
  timeOfDay += 0.0003;
  if (timeOfDay > 1) timeOfDay = 0;

  let r, g, b;
  if (timeOfDay < 0.5) {
    let t = timeOfDay * 2;
    r = 10 + 100 * t;
    g = 10 + 100 * t;
    b = 40 + 150 * t;
  } else {
    let t = (timeOfDay - 0.5) * 2;
    r = 110 - 100 * t;
    g = 110 - 100 * t;
    b = 190 - 150 * t;
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `rgb(${r},${g},${b})`);
  gradient.addColorStop(1, `rgb(${r / 2},${g / 2},${b / 2})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Change weather every ~30 seconds
  if (frame - weatherChangeFrame > 1800) {
    const types = ["clear", "cloudy", "stars"];
    weather = types[Math.floor(Math.random() * types.length)];
    weatherChangeFrame = frame;
  }

  if (weather === "stars" && timeOfDay > 0.4 && timeOfDay < 0.8) drawStars();
}

function drawStars() {
  if (stars.length < 100 && frame % 5 === 0) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height / 2),
      size: Math.random() * 2,
      twinkle: Math.random()
    });
  }
  stars.forEach(star => {
    ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(frame * 0.05 + star.twinkle)})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

// Bird with two flapping wings
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // Left Wing
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(-wingAngle * 0.5);
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.ellipse(-bird.radius * 0.8, 0, bird.radius * 0.7, bird.radius * 0.4, Math.PI / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Wing
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(wingAngle * 0.5);
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.ellipse(bird.radius * 0.8, 0, bird.radius * 0.7, bird.radius * 0.4, Math.PI / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

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

function drawPipes() {
  ctx.fillStyle = "#2ecc71";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    let gap = Math.max(150 - level * 10, 90);
    let top = Math.random() * (canvas.height / 2);
    let bottom = top + gap;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: bottom,
      speed: 3 + level
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
      if (score % 10 === 0) {
        level++;
        levelDisplay.textContent = "Level " + level;
      }
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

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
  if (weather === "cloudy" || weather === "clear") {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.radius * 0.6, cloud.y + 10, cloud.radius * 0.7, 0, Math.PI * 2);
      ctx.arc(cloud.x - cloud.radius * 0.6, cloud.y + 10, cloud.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  wingAngle += 0.2 * wingDirection;
  if (wingAngle > 1 || wingAngle < -1) wingDirection *= -1;

  if (bird.y + bird.radius > canvas.height) {
    bird.y = canvas.height - bird.radius;
    gameOver = true;
  }
  if (bird.y - bird.radius < 0) {
    bird.y = bird.radius;
    gameOver = true;
  }
}

function draw() {
  drawBackground();
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

function endGame() {
  lastScoreDisplay.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  bestScoreDisplay.textContent = bestScore;
  awaitingStart = true;

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  scoreBoard.classList.add("hidden");
  startBtn.classList.add("hidden");

  endGameTimeout = setTimeout(() => {
    scoreBoard.classList.remove("hidden");
    scoreBoard.classList.add("fade-in");
    setTimeout(() => scoreBoard.classList.add("show"), 50);
    startBtn.classList.remove("hidden");
  }, 800);
}

function startGame() {
  if (endGameTimeout) {
    clearTimeout(endGameTimeout);
    endGameTimeout = null;
  }

  scoreBoard.classList.add("hidden");
  scoreBoard.classList.remove("fade-in", "show");
  startBtn.classList.add("hidden");

  initGame();
  gameOver = false;
  awaitingStart = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
}

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
