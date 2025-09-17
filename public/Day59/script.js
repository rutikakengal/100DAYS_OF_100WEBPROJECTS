const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const timeLeft = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const highScoreDisplay = document.getElementById('highScore');

let lastHole;
let time = 30;
let score = 0;
let highScore = localStorage.getItem("whackHighScore") || 0;
let gameInterval;
let countdownInterval;

highScoreDisplay.textContent = highScore;

// Pick random hole
function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

// Mole popup
function popUp() {
  const stayTime = 1200;
  const hole = randomHole(holes);
  let mole = document.createElement('div');
  mole.classList.add('mole');
  hole.appendChild(mole);

  setTimeout(() => mole.classList.add('up'), 100);

  mole.addEventListener('click', () => {
    if (mole.classList.contains('up')) {
      score++;
      scoreBoard.textContent = score;
      mole.classList.remove('up');
    }
  });

  setTimeout(() => {
    mole.classList.remove('up');
    setTimeout(() => hole.removeChild(mole), 200);
  }, stayTime);
}

// Game start
function startGame() {
  score = 0;
  time = 30;
  scoreBoard.textContent = score;
  timeLeft.textContent = time;
  gameOver.classList.add('hidden');
  startBtn.style.display = "none";

  countdownInterval = setInterval(() => {
    time--;
    timeLeft.textContent = time;
    if (time <= 0) {
      clearInterval(countdownInterval);
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);

  gameInterval = setInterval(() => {
    popUp();
    if (Math.random() > 0.5) setTimeout(popUp, 300);
  }, 600);
}

// Game end
function endGame() {
  gameOver.classList.remove('hidden');
  finalScore.textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("whackHighScore", highScore);
    highScoreDisplay.textContent = highScore;
  }

  startBtn.style.display = "block";
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
