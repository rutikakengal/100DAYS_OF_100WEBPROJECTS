
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;
let moves = 0;
let seconds = 0;
let timerId = null;
let gameStarted = false;


let bestMoves = localStorage.getItem('bestMoves');
let bestTime  = localStorage.getItem('bestTime');
bestMoves = bestMoves !== null ? Number(bestMoves) : null;
bestTime  = bestTime  !== null ? Number(bestTime)  : null;

const icons = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍑", "🍒"];
let dupArr = [];


function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

function updateTime() {
  document.getElementById('time').textContent = formatTime(seconds);
}

function updateMoves() {
  document.getElementById('moves').textContent = moves;
}

function updateBestUI() {
  document.getElementById('bestMoves').textContent = bestMoves !== null ? bestMoves : '-';
  document.getElementById('bestTime').textContent  = bestTime  !== null ? formatTime(bestTime) : '--:--';
}


function tick() {
  seconds++;
  updateTime();
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}


function shufArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


function create() {
  const div = document.querySelector(".game-board");
  div.innerHTML = ""; 
  shufArr(dupArr);

  for (const els of dupArr) {
    const box = document.createElement("div");
    box.classList.add("card");
    box.dataset.icon = els;

    const front = document.createElement("div");
    front.classList.add("front");
    front.innerText = els;

    const back = document.createElement("div");
    back.classList.add("back");

    box.appendChild(front);
    box.appendChild(back);
    div.appendChild(box);

    box.addEventListener("click", flipcard);
  }
}


function flipcard(event) {
  if (lockBoard) return;

  const card = event.currentTarget;
  if (card.classList.contains("flip")) return;

  if (!gameStarted) {
    gameStarted = true;
    timerId = setInterval(tick, 1000);
  }

  card.classList.add("flip");

  if (firstCard === null) {
    firstCard = card;
    return;
  } else {
    secondCard = card;
    lockBoard = true;
    moves++;
    updateMoves();
    checkMatch();
  }
}

function checkMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    firstCard.removeEventListener("click", flipcard);
    secondCard.removeEventListener("click", flipcard);
    pairsFound++;

    
    if (pairsFound === icons.length) {
      stopTimer();

    
      if (bestMoves === null || moves < bestMoves) {
        bestMoves = moves;
        localStorage.setItem('bestMoves', bestMoves);
      }

      
      if (bestTime === null || seconds < bestTime) {
        bestTime = seconds;
        localStorage.setItem('bestTime', bestTime);
      }

      updateBestUI();

  
      setTimeout(() => {
        alert(`🎉 You win! Time: ${formatTime(seconds)}, Moves: ${moves}`);
      }, 120);
    }

    resetBoard();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 900);
  }
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}


function restartGame() {
  stopTimer();
  seconds = 0; updateTime();
  moves = 0;   updateMoves();
  pairsFound = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameStarted = false;

  dupArr = [...icons, ...icons]; 
  create();
}


updateBestUI();
updateMoves();
updateTime();

document.getElementById('restartBtn').addEventListener('click', restartGame);


restartGame();





