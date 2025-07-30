const emojis = [
  '<i class="fa-brands fa-html5 icon-html"></i>', '<i class="fa-brands fa-html5 icon-html"></i>',
  '<i class="fa-brands fa-css3-alt icon-css"></i>', '<i class="fa-brands fa-css3-alt icon-css"></i>',
  '<i class="fa-brands fa-square-js icon-js"></i>', '<i class="fa-brands fa-square-js icon-js"></i>',
  '<i class="fa-solid fa-laptop-code icon-laptop"></i>', '<i class="fa-solid fa-laptop-code icon-laptop"></i>',
  '<i class="fa-solid fa-wand-magic-sparkles icon-wand"></i>', '<i class="fa-solid fa-wand-magic-sparkles icon-wand"></i>',
  '<i class="fa-solid fa-lightbulb icon-bulb"></i>', '<i class="fa-solid fa-lightbulb icon-bulb"></i>',
  '<i class="fa-solid fa-screwdriver-wrench icon-tools"></i>', '<i class="fa-solid fa-screwdriver-wrench icon-tools"></i>',
  '<i class="fa-solid fa-rocket icon-rocket"></i>', '<i class="fa-solid fa-rocket icon-rocket"></i>'
];

let shuffled = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;
let score = 0;
let time = 0;
let timerInterval = null;
let timerStarted = false;
let bestScore = localStorage.getItem('memoryGameBest') || '--';

const bestScoreDisplay = document.getElementById('bestScore');
const board = document.querySelector('.game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

function shuffle() {
  shuffled = emojis.sort(() => 0.5 - Math.random());
}

function createBoard() {
  board.innerHTML = '';
  matchedCount = 0;
  score = 0;
  bestScoreDisplay.textContent = bestScore;
  time = 0;
  timerStarted = false;
  clearInterval(timerInterval);
  timerDisplay.textContent = '0';
  scoreDisplay.textContent = '0';
  message.textContent = '';
  shuffle();

  shuffled.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerHTML = ''; // 
    board.appendChild(card);
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timerDisplay.textContent = time;
  }, 1000);
}

function flipCard(e) {
  const card = e.target;
  if (
    lockBoard ||
    card.classList.contains('flipped') ||
    card.classList.contains('matched')
  ) return;

  if (!timerStarted) {
    timerStarted = true;
    startTimer();
  }

  card.classList.add('flipped');
  card.innerHTML = card.dataset.emoji; 

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    score++;
    scoreDisplay.textContent = score;
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCount += 2;

    if (matchedCount === emojis.length) {
      clearInterval(timerInterval);

     let result = '<i class="fa-solid fa-fire"></i> You matched all the cards in ' + score + ' moves and ' + time + ' seconds!';

    if (bestScore === '--' || score < parseInt(bestScore)) {
    bestScore = score;
    localStorage.setItem('memoryGameBest', bestScore);
    bestScoreDisplay.textContent = bestScore;
    result += ' <br><i class="fa-solid fa-trophy" title="New Best Score!"></i> New Best Score!';
    }

    message.innerHTML = result;

    }

    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.innerHTML = '';  
      secondCard.innerHTML = ''; 
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

board.addEventListener('click', (e) => {
  if (e.target.classList.contains('card')) {
    flipCard(e);
  }
});

restartBtn.addEventListener('click', createBoard);

createBoard();