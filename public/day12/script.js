
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const playerSpan = document.getElementById('player');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset');

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      message.textContent = `🎉 Player ${board[a]} wins!`;
      isGameActive = false;
      return true;
    }
  }

  if (!board.includes("")) {
    message.textContent = "😐 It's a tie!";
    isGameActive = false;
    return true;
  }

  return false;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] === "" && isGameActive) {
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (!checkWinner()) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      playerSpan.textContent = currentPlayer;
    }
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  cells.forEach(cell => (cell.textContent = ""));
  playerSpan.textContent = currentPlayer;
  message.textContent = "";
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth > 600 ? 800 : window.innerWidth - 20;
canvas.height = window.innerHeight > 600 ? 500 : window.innerHeight / 1.5;

// Game variables
let paddleHeight = 80;
let paddleWidth = 10;
let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;
let player1Score = 0;
let player2Score = 0;
let gameMode = "";
let difficulty = "medium";
let paused = false;
let gameStarted = false;

const keysPressed = {};
const paddleSpeed = 6;

const difficultySpeeds = {
  low: 3,
  medium: 4,
  hard: 6
};

// Event listeners for desktop
window.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});

// Touch support for mobile
canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);

function handleTouch(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touchY = e.touches[0].clientY - rect.top;

  if (gameMode === "cpu") {
    paddle1Y = touchY - paddleHeight / 2;
  } else if (gameMode === "2p") {
    if (ballX < canvas.width / 2) {
      paddle1Y = touchY - paddleHeight / 2;
    } else {
      paddle2Y = touchY - paddleHeight / 2;
    }
  }

  paddle1Y = Math.max(0, Math.min(canvas.height - paddleHeight, paddle1Y));
  paddle2Y = Math.max(0, Math.min(canvas.height - paddleHeight, paddle2Y));
}

function setDifficulty(level) {
  difficulty = level;
}

function startGame(mode) {
  gameMode = mode;
  ballSpeedX = difficultySpeeds[difficulty];
  ballSpeedY = difficultySpeeds[difficulty];
  document.getElementById("controls").style.display = "block";
  document.getElementById("options").style.display = "none";
  gameStarted = true;
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  player1Score = 0;
  player2Score = 0;
  resetBall();
  gameStarted = false;
  document.getElementById("controls").style.display = "none";
  document.getElementById("options").style.display = "block";
  paddle1Y = canvas.height / 2 - paddleHeight / 2;
  paddle2Y = canvas.height / 2 - paddleHeight / 2;
  drawEverything();
}

function togglePause() {
  paused = !paused;
  document.getElementById("pauseResumeBtn").innerText = paused ? "Resume" : "Pause";
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = difficultySpeeds[difficulty] * (Math.random() > 0.5 ? 1 : -1);
}

function drawEverything() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
  }

  ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "32px Arial";
  ctx.fillText(player1Score, canvas.width / 4, 40);
  ctx.fillText(player2Score, 3 * canvas.width / 4, 40);
}

function moveEverything() {
  if (paused || !gameStarted) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY = -ballSpeedY;

  if (
    ballX < paddleWidth &&
    ballY > paddle1Y &&
    ballY < paddle1Y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    player1Score++;
  }

  if (
    ballX > canvas.width - paddleWidth &&
    ballY > paddle2Y &&
    ballY < paddle2Y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    player2Score++;
  }

  if (ballX < 0) {
    player2Score++;
    resetBall();
  } else if (ballX > canvas.width) {
    player1Score++;
    resetBall();
  }

  if (gameMode === "cpu") {
    if (keysPressed["ArrowUp"] && paddle1Y > 0) paddle1Y -= paddleSpeed;
    if (keysPressed["ArrowDown"] && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed;

    const center = paddle2Y + paddleHeight / 2;
    if (center < ballY) paddle2Y += paddleSpeed * 0.85;
    if (center > ballY) paddle2Y -= paddleSpeed * 0.85;
  } else if (gameMode === "2p") {
    if (ballX < canvas.width / 2) {
      if (keysPressed["ArrowUp"] && paddle1Y > 0) paddle1Y -= paddleSpeed;
      if (keysPressed["ArrowDown"] && paddle1Y < canvas.height - paddleHeight) paddle1Y += paddleSpeed;
    } else {
      if (keysPressed["ArrowUp"] && paddle2Y > 0) paddle2Y -= paddleSpeed;
      if (keysPressed["ArrowDown"] && paddle2Y < canvas.height - paddleHeight) paddle2Y += paddleSpeed;
    }
  }
}

function gameLoop() {
  drawEverything();
  moveEverything();
  if (gameStarted) requestAnimationFrame(gameLoop);
}

drawEverything();

