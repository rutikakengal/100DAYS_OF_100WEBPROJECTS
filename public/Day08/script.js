const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const timerDisplay = document.getElementById('timer');
const highscoreDisplay = document.getElementById('highscore');
const difficultySelect = document.getElementById('difficulty');

let rows, cols, mineCount, gameOver, timer, interval;
let grid = [];

const settings = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 }
};

difficultySelect.addEventListener('change', () => setupGame());
restartBtn.addEventListener('click', () => setupGame());

function setupGame() {
  const level = difficultySelect.value;
  ({ rows, cols, mines: mineCount } = settings[level]);
  gameOver = false;
  clearInterval(interval);
  timer = 0;
  timerDisplay.textContent = "⏱️ 0s";
  statusText.textContent = "Click to Start";
  restartBtn.style.display = 'none';
  updateHighScore();

  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  grid = [];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => revealCell(r, c));
      board.appendChild(cell);
      row.push({ revealed: false, mine: false, flagged: false, adjacent: 0, element: cell });
    }
    grid.push(row);
  }

  placeMines();
  calculateAdjacency();
  startTimer();
}

function placeMines() {
  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!grid[r][c].mine) {
      grid[r][c].mine = true;
      placed++;
    }
  }
}

function calculateAdjacency() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const nr = r + i;
          const nc = c + j;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine) {
            count++;
          }
        }
      }
      grid[r][c].adjacent = count;
    }
  }
}

function revealCell(r, c) {
  if (gameOver || grid[r][c].revealed) return;

  const cell = grid[r][c];
  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.mine) {
    document.getElementById('explosion-sound').play();
    cell.element.textContent = '💣';
    endGame(false);
    return;
  } else {
    document.getElementById('click-sound').play();
  }

  if (cell.adjacent > 0) {
    cell.element.textContent = cell.adjacent;
  } else {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const nr = r + i;
        const nc = c + j;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          revealCell(nr, nc);
        }
      }
    }
  }

  checkWin();
}

function checkWin() {
  let revealedCount = 0;
  grid.flat().forEach(cell => {
    if (cell.revealed) revealedCount++;
  });

  if (revealedCount === rows * cols - mineCount) {
    endGame(true);
  }
}

function endGame(win) {
  gameOver = true;
  clearInterval(interval);
  statusText.textContent = win ? `🎉 You Win in ${timer}s!` : '💥 Game Over';
  restartBtn.style.display = 'inline-block';

  if (win) {
    const level = difficultySelect.value;
    const key = `highScore_${level}`;
    const best = localStorage.getItem(key);
    if (!best || timer < parseInt(best)) {
      localStorage.setItem(key, timer);
      updateHighScore();
    }
  }

  grid.flat().forEach(cell => {
    if (cell.mine) {
      cell.element.textContent = '💣';
      cell.element.classList.add('revealed', 'mine');
    }
  });
}

function startTimer() {
  clearInterval(interval);
  timer = 0;
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `⏱️ ${timer}s`;
  }, 1000);
}

function updateHighScore() {
  const level = difficultySelect.value;
  const best = localStorage.getItem(`highScore_${level}`);
  highscoreDisplay.textContent = best ? `🏆 Best: ${best}s` : '🏆 No record';
}

setupGame();