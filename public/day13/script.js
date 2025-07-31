const board = document.getElementById("board");
const popup = document.getElementById("popup");
const gridSizeSelector = document.getElementById("gridSize");

let gridSize = 4;
let tiles = [];
let emptyIndex;

const colors = [
  "#ff6b6b", "#6c5ce7", "#00b894", "#fdcb6e",
  "#e17055", "#0984e3", "#e84393", "#fab1a0",
  "#55efc4", "#ffeaa7", "#74b9ff", "#fd79a8",
  "#636e72", "#b2bec3", "#fd556f", "#00cec9"
];

function init() {
  gridSize = parseInt(gridSizeSelector.value);
  tiles = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
  tiles.push(null); // Empty tile
  emptyIndex = tiles.length - 1;
  render();
}

function shuffle() {
  let shuffled;
  do {
    shuffled = [...tiles].sort(() => Math.random() - 0.5);
  } while (!isSolvable(shuffled));
  tiles = shuffled;
  emptyIndex = tiles.indexOf(null);
  render();
}

function isSolvable(arr) {
  let invCount = 0;
  const flat = arr.filter(n => n !== null);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) invCount++;
    }
  }
  const emptyRow = Math.floor(arr.indexOf(null) / gridSize);
  return (invCount + emptyRow) % 2 === 0;
}

function render() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

  tiles.forEach((val, idx) => {
    const div = document.createElement("div");
    div.classList.add("tile");

    if (val === null) {
      div.classList.add("empty");
    } else {
      div.textContent = val;
      div.style.backgroundColor = colors[(val - 1) % colors.length];
      if (isMovable(idx)) {
        div.addEventListener("click", () => handleMove(idx));
      }
    }

    board.appendChild(div);
  });
}

function isMovable(index) {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;
  return (
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1)
  );
}

function handleMove(index) {
  if (!isMovable(index)) return;
  [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
  emptyIndex = index;
  render();
  checkWin();
}

function checkWin() {
  const isWin = tiles
    .slice(0, tiles.length - 1)
    .every((val, i) => val === i + 1);

  if (isWin) {
    popup.style.display = "block";
  }
}

function closePopup() {
  popup.style.display = "none";
  shuffle();
}

document.getElementById("shuffleBtn").addEventListener("click", shuffle);
gridSizeSelector.addEventListener("change", () => {
  init();
  shuffle();
});

init();
shuffle();
