// 2048 Game Main Logic
const GRID_SIZE = 4;
let grid = [];
let score = 0;

const gridContainer = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const newGameBtn = document.querySelector('.new-game-btn');

function initGrid() {
  grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
  addRandomTile();
  addRandomTile();
  score = 0;
  updateScore();
  renderGrid();
}

function addRandomTile() {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function renderGrid() {
  gridContainer.innerHTML = '';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const value = grid[r][c];
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (value) {
        tile.textContent = value;
        tile.setAttribute('data-value', value);
      }
      gridContainer.appendChild(tile);
    }
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function move(direction) {
  let moved = false;
  let merged = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
  function slide(row) {
    let arr = row.filter(v => v);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(v => v);
    while (arr.length < GRID_SIZE) arr.push(0);
    return arr;
  }
  if (direction === 'left') {
    for (let r = 0; r < GRID_SIZE; r++) {
      const old = [...grid[r]];
      grid[r] = slide(grid[r]);
      if (grid[r].toString() !== old.toString()) moved = true;
    }
  } else if (direction === 'right') {
    for (let r = 0; r < GRID_SIZE; r++) {
      const old = [...grid[r]];
      grid[r] = slide(grid[r].slice().reverse()).reverse();
      if (grid[r].toString() !== old.toString()) moved = true;
    }
  } else if (direction === 'up') {
    for (let c = 0; c < GRID_SIZE; c++) {
      let col = grid.map(row => row[c]);
      const old = [...col];
      col = slide(col);
      for (let r = 0; r < GRID_SIZE; r++) grid[r][c] = col[r];
      if (col.toString() !== old.toString()) moved = true;
    }
  } else if (direction === 'down') {
    for (let c = 0; c < GRID_SIZE; c++) {
      let col = grid.map(row => row[c]);
      const old = [...col];
      col = slide(col.slice().reverse()).reverse();
      for (let r = 0; r < GRID_SIZE; r++) grid[r][c] = col[r];
      if (col.toString() !== old.toString()) moved = true;
    }
  }
  if (moved) {
    addRandomTile();
    updateScore();
    renderGrid();
    if (isGameOver()) alert('Game Over!');
    if (isWin()) alert('You Win!');
  }
}

function isGameOver() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return false;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

function isWin() {
  return grid.flat().includes(2048);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
});

newGameBtn.addEventListener('click', initGrid);

initGrid();
