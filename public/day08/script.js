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
