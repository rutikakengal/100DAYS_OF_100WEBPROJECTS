const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

// Responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Bird properties
let bird = {
  x: canvas.width / 6,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 0.5,
  lift: -8
};

let pipes = [];
let clouds = [];
let frame = 0;
let score = 0;
let gameOver = false;
let awaitingStart = true;

// Draw Bird using canvas shapes
function drawBird() {
  // body
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.beginPath();
  ctx.arc(bird.x + bird.radius * 0.8, bird.y - bird.radius * 0.3, bird.radius * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // eye
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(bird.x + bird.radius * 1.0, bird.y - bird.radius * 0.4, bird.radius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x + bird.radius * 1.0, bird.y - bird.radius * 0.4, bird.radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // beak
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.radius * 1.4, bird.y - bird.radius * 0.2);
  ctx.lineTo(bird.x + bird.radius * 2.0, bird.y);
  ctx.lineTo(bird.x + bird.radius * 1.4, bird.y + bird.radius * 0.2);
  ctx.closePath();
  ctx.fill();
}

// Draw Pipes
function drawPipes() {
  ctx.fillStyle = "#2ecc71";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

// Generate moving clouds
function updateClouds() {
  if (frame % 150 === 0) {
    clouds.push({
      x: canvas.width,
      y: Math.random() * (canvas.height / 3),
      radius: 40 + Math.random() * 30,
      speed: 1 + Math.random()
    });
  }
  clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
  });
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

function updatePipes() {
  if (frame % 90 === 0) {
    let gap = 150;
    let top = Math.random() * (canvas.height / 2);
    let bottom = top + gap;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: bottom
    });
  }
  pipes.forEach(pipe => {
    pipe.x -= 3;

    // Collision detection
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipe.width &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score update
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      scoreDisplay.textContent = score;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  drawBird();
  drawPipes();
}

// ✅ Single update function
function update() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText("Tap or Press Space to Restart", canvas.width / 2, canvas.height / 2 + 50);

    // Show start button and mark awaiting start
    startBtn.classList.remove("hidden");
    awaitingStart = true;
    return;
  }

  updateBird();
  updatePipes();
  updateClouds();
  draw();
  frame++;
  requestAnimationFrame(update);
}

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  clouds = [];
  score = 0;
  scoreDisplay.textContent = 0;
  frame = 0;
  gameOver = false;
  update();
}

function startGame() {
  awaitingStart = false;
  startBtn.classList.add("hidden");
  resetGame();
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

// Start button event
startBtn.addEventListener("click", startGame);
