const COLS = 7, ROWS = 6;
const boardEl = document.getElementById('board');
const playerEl = document.getElementById('playerName');
const botEl = document.getElementById('botName');
const playerBox = document.getElementById('playerBox');
const botBox = document.getElementById('botBox');

const restartBtn = document.getElementById('restart');

let grid, current, gameOver;

function setup() {
    
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  boardEl.innerHTML = '';
  gameOver = false;
  current = 1; // 1 = player, 2 = bot
playerBox.classList.add('player-turn');
botBox.classList.remove('bot-turn');


  // create board cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.col = c;
      cell.addEventListener('mouseenter', () => hoverColumn(c, true));
      cell.addEventListener('mouseleave', () => hoverColumn(c, false));
      cell.addEventListener('click', () => makeMove(c));
      boardEl.appendChild(cell);
    }
  }

  showOverlayMessage("Game Started!");
}

function hoverColumn(col, on) {
  document.querySelectorAll(`.cell[data-col='${col}']`)
    .forEach(c => c.classList.toggle('hover', on));
}
function makeMove(col) {
  if (gameOver) return;
  const row = findBottom(col);
  if (row === -1) return;

  grid[row][col] = current;
  drawToken(row, col);

  const winningLine = checkWin(row, col);
if (winningLine) {
  highlightWinningDiscs(winningLine);
  setTimeout(() => {
    showOverlayMessage(current === 1 ? 'You Win!' : 'You Lose...');
  }, 800);
  gameOver = true;
  return;
}



  // Switch turns
  current = 3 - current;
  updateHighlight();

  if (current === 2) {
    setTimeout(aiMove, 400);
  }
}



function playTurn(col) {
  const row = findBottom(col);
  if (row === -1) return;
  grid[row][col] = current;
  drawToken(row, col);

const winningLine = checkWin(row, col);
if (winningLine) {
  highlightWinningDiscs(winningLine);
  setTimeout(() => {
    showOverlayMessage(current === 1 ? 'You Win!' : 'You Lose...');
  }, 800);
  gameOver = true;
  return;
}



  current = 3 - current;
  updateHighlight();

  if (current === 2) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (gameOver) return;

  // Step 1: Block the player
  for (let c = 0; c < COLS; c++) {
    const r = findBottom(c);
    if (r === -1) continue;
    grid[r][c] = 1;  // simulate player move
    if (checkWin(r, c)) {
      grid[r][c] = 0; // reset
      makeMove(c);    // block
      return;
    }
    grid[r][c] = 0; // reset
  }

  // Step 2: Try to win
  for (let c = 0; c < COLS; c++) {
    const r = findBottom(c);
    if (r === -1) continue;
    grid[r][c] = 2;  // simulate AI move
    if (checkWin(r, c)) {
      grid[r][c] = 0; // reset
      makeMove(c);    // win
      return;
    }
    grid[r][c] = 0; // reset
  }

  // Step 3: Random fallback
  const validCols = [];
  for (let c = 0; c < COLS; c++) {
    if (findBottom(c) !== -1) validCols.push(c);
  }
  if (validCols.length > 0) {
    const col = validCols[Math.floor(Math.random() * validCols.length)];
    makeMove(col);
  }
}


function updateHighlight() {
  const playerBox = document.getElementById('playerBox');
  const botBox = document.getElementById('botBox');
  if (current === 1) {
    playerBox.classList.add('player-turn');
    botBox.classList.remove('bot-turn');
  } else {
    botBox.classList.add('bot-turn');
    playerBox.classList.remove('player-turn');
  }
}


function findBottom(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === 0) return r;
  }
  return -1;
}

function drawToken(r, c) {
  const idx = r * COLS + c;
  const cell = boardEl.children[idx];
  const tok = document.createElement('div');
  tok.className = 'token';
  tok.style.background = current === 1 ? 'var(--p1)' : 'var(--p2)';
  tok.style.bottom = '-60px';
  tok.style.transition = 'bottom 0.4s ease-in';
  cell.appendChild(tok);
  requestAnimationFrame(() => {
    tok.style.bottom = '2px';
  });
}



function checkWin(r, c) {
  const player = grid[r][c];
  const directions = [[1,0],[0,1],[1,1],[1,-1]];
  for (let [dr, dc] of directions) {
    let line = [[r, c]];
    line = line.concat(getLine(r, c, dr, dc, player));
    line = line.concat(getLine(r, c, -dr, -dc, player));
    if (line.length >= 4) return line.slice(0, 4); // Return 4 winning coords
  }
  return null;
}

function getLine(r, c, dr, dc, player) {
  let res = [];
  let row = r + dr, col = c + dc;
  while (row >= 0 && row < ROWS && col >= 0 && col < COLS && grid[row][col] === player) {
    res.push([row, col]);
    row += dr;
    col += dc;
  }
  return res;
}
function highlightWinningDiscs(line) {
  for (let [r, c] of line) {
    const idx = r * COLS + c;
    const cell = boardEl.children[idx];
    const star = document.createElement('span');
    star.textContent = '⭐';
    Object.assign(star.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '20px',
      pointerEvents: 'none'
    });
    cell.appendChild(star);
  }
}


function countDirection(r, c, dr, dc, player) {
  let count = 0;
  let row = r + dr;
  let col = c + dc;
  while (row >= 0 && row < ROWS && col >= 0 && col < COLS && grid[row][col] === player) {
    count++;
    row += dr;
    col += dc;
  }
  return count;
}
function showOverlayMessage(msg, duration = 2000) {
  const overlay = document.getElementById('overlay');
  overlay.textContent = msg;
  overlay.classList.remove('hidden');
  overlay.classList.add('show');

  setTimeout(() => {
    overlay.classList.remove('show');
    overlay.classList.add('hidden');
  }, duration);
}



restartBtn.addEventListener('click', setup);
setup();
