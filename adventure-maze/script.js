const player = document.getElementById("player");
const maze = document.getElementById("maze");
const exit = document.getElementById("exit");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const levelText = document.getElementById("level");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

const infoBar = document.querySelector(".info-bar");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("startBtn");

let playerX = 10;
let playerY = 10;
const step = 10;

let level = 1;
let score = 0;
let timeLeft = 30;
let timerInterval;

const nextLevelBtn = document.createElement("button");
nextLevelBtn.innerText = "➡️ Jump to Next Level";
nextLevelBtn.style.display = "none";
nextLevelBtn.style.marginTop = "10px";
nextLevelBtn.style.padding = "8px 15px";
nextLevelBtn.style.fontSize = "16px";
nextLevelBtn.style.background = "#007bff";
nextLevelBtn.style.color = "white";
nextLevelBtn.style.border = "none";
nextLevelBtn.style.borderRadius = "5px";
nextLevelBtn.style.cursor = "pointer";
status.insertAdjacentElement("afterend", nextLevelBtn);

const levels = [
  [
    { top: 50, left: 100, width: 200, height: 20 },
    { top: 150, left: 50, width: 20, height: 200 }
  ],
  [
    { top: 50, left: 80, width: 20, height: 300 },
    { top: 120, left: 120, width: 200, height: 20 },
    { top: 220, left: 50, width: 250, height: 20 },
    { top: 280, left: 280, width: 20, height: 100 }
  ],
  [
    { top: 60, left: 60, width: 20, height: 250 },
    { top: 100, left: 120, width: 220, height: 20 },
    { top: 180, left: 50, width: 250, height: 20 },
    { top: 220, left: 200, width: 20, height: 150 },
    { top: 300, left: 100, width: 220, height: 20 }
  ]
];

function loadLevel(lvl) {
  maze.querySelectorAll(".wall").forEach(w => w.remove());
  levels[lvl - 1].forEach(w => {
    const wall = document.createElement("div");
    wall.className = "wall";
    wall.style.top = w.top + "px";
    wall.style.left = w.left + "px";
    wall.style.width = w.width + "px";
    wall.style.height = w.height + "px";
    maze.appendChild(wall);
  });
}

function resetPlayer() {
  playerX = 10;
  playerY = 10;
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
}

function shakePlayer() {
  player.style.transition = "transform 0.1s";
  player.style.transform = "translateX(-5px)";
  setTimeout(() => {
    player.style.transform = "translateX(5px)";
  }, 100);
  setTimeout(() => {
    player.style.transform = "translateX(0)";
  }, 200);
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerText.innerText = "Time: " + timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      status.innerText = "⏳ Time's up! Game Over!";
      restartBtn.style.display = "block";
    }
  }, 1000);
}

function launchConfetti() {
  const confetti = document.createElement("div");
  confetti.innerText = "🎉";
  confetti.style.position = "absolute";
  confetti.style.left = playerX + "px";
  confetti.style.top = playerY + "px";
  confetti.style.fontSize = "24px";
  maze.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1000);
}

function completeLevel() {
  clearInterval(timerInterval);
  score += 100;
  scoreText.innerText = "Score: " + score;
  status.innerText = `🏆 Level ${level} Completed! 🎉`;
  launchConfetti();
  nextLevelBtn.style.display = "block";
}

nextLevelBtn.addEventListener("click", () => {
  level++;
  if (level > levels.length) {
    status.innerText = "🎉 You won the game with Score: " + score;
    nextLevelBtn.style.display = "none";
    restartBtn.style.display = "block";
  } else {
    levelText.innerText = "Level: " + level;
    nextLevelBtn.style.display = "none";
    loadLevel(level);
    resetPlayer();
    startTimer();
    status.innerText = `🚀 Level ${level} started!`;
  }
});

document.addEventListener("keydown", (e) => {
  if (
    restartBtn.style.display === "block" ||
    maze.style.display === "none" ||
    nextLevelBtn.style.display === "block"
  )
    return;

  let newX = playerX;
  let newY = playerY;

  if (e.key === "ArrowUp") newY -= step;
  if (e.key === "ArrowDown") newY += step;
  if (e.key === "ArrowLeft") newX -= step;
  if (e.key === "ArrowRight") newX += step;

  if (newX < 0 || newY < 0 || newX + 20 > maze.offsetWidth || newY + 20 > maze.offsetHeight) {
    status.innerText = "🚫 Can't move outside!";
    shakePlayer();
    return;
  }

  let collision = false;
  const walls = document.querySelectorAll(".wall");
  walls.forEach((wall) => {
    const rect = wall.getBoundingClientRect();
    const mazeRect = maze.getBoundingClientRect();
    const playerRect = {
      left: newX,
      top: newY,
      right: newX + 20,
      bottom: newY + 20
    };
    const wallRect = {
      left: rect.left - mazeRect.left,
      top: rect.top - mazeRect.top,
      right: rect.right - mazeRect.left,
      bottom: rect.bottom - mazeRect.top
    };
    if (
      playerRect.left < wallRect.right &&
      playerRect.right > wallRect.left &&
      playerRect.top < wallRect.bottom &&
      playerRect.bottom > wallRect.top
    ) {
      collision = true;
    }
  });

  if (!collision) {
    playerX = newX;
    playerY = newY;
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
    status.innerText = "🚶 Moving...";
  } else {
    status.innerText = "⚠️ Oops! Hit the wall!";
    shakePlayer();
    return;
  }

  const exitRect = exit.getBoundingClientRect();
  const mazeRect = maze.getBoundingClientRect();
  const relativeExit = {
    left: exitRect.left - mazeRect.left,
    top: exitRect.top - mazeRect.top,
    right: exitRect.right - mazeRect.left,
    bottom: exitRect.bottom - mazeRect.top
  };

  if (
    playerX < relativeExit.right &&
    playerX + 20 > relativeExit.left &&
    playerY < relativeExit.bottom &&
    playerY + 20 > relativeExit.top
  ) {
    completeLevel();
  }
});

restartBtn.addEventListener("click", () => {
  level = 1;
  score = 0;
  levelText.innerText = "Level: " + level;
  scoreText.innerText = "Score: " + score;
  restartBtn.style.display = "none";
  loadLevel(level);
  resetPlayer();
  startTimer();
  status.innerText = "Game Restarted!";
});

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  infoBar.style.display = "block";
  maze.style.display = "block";
  loadLevel(level);
  resetPlayer();
  startTimer();
  status.innerText = "🚀 Level 1 started!";
});
