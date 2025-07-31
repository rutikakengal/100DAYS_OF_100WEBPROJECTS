const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileCnt = 20;
const tileSize = canvas.width / tileCnt;

// Sounds
const eatS = new Audio("sounds/eat.mp3");
const crashS = new Audio("sounds/crash.mp3");
const turnS = new Audio("sounds/turn.mp3");
const clickS = new Audio("sounds/click.mp3");
const ambience = document.getElementById("ambience");

// UI Elements
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const overlay = document.getElementById("overlay");
const overlayTxt = document.getElementById("overlayText");
const scoreSpan = document.getElementById("score");
const highScoreSpan = document.getElementById("highScore");
const fpsSpan = document.getElementById("fps");
const modeBtns = document.querySelectorAll(".modeBtn");
const skinBtns = document.querySelectorAll(".skinBtn");
const arrowPad = document.getElementById("arrowPad");

// Game State
let headX, headY, velX, velY, snakeParts, tailLen, appleX, appleY;
let score, highScore = +localStorage.getItem("highScore") || 0;
let mode = localStorage.getItem("mode") || "classic";
let skin = localStorage.getItem("skin") || "retro";
let speed, portal1 = null, portal2 = null;
let lastTime = 0, frames = 0, fps = 0;
let running = false, gameLoopId;

function selectModeSkin() {
  modeBtns.forEach(b => b.classList.toggle("selected", b.dataset.mode === mode));
  skinBtns.forEach(b => b.classList.toggle("selected", b.dataset.skin === skin));
}
selectModeSkin();
highScoreSpan.textContent = highScore;
applySkin(skin);

function randomFreeTile(exclude = []) {
  let valid = false, x, y;
  while (!valid) {
    x = Math.floor(Math.random() * tileCnt);
    y = Math.floor(Math.random() * tileCnt);
    valid = !exclude.some(e => (e.x === x && e.y === y));
  }
  return { x, y };
}

function resetGameVars() {
  headX = 10; headY = 10;
  velX = 0; velY = 0;
  snakeParts = [];
  tailLen = 3;
  score = 0;
  speed = mode === "slow" ? 4 : 7;
  scoreSpan.textContent = score;
  portal1 = portal2 = null;
  if (mode === "portal") placePortals();
  placeApple();
}

function newGame() {
  resetGameVars();
  overlay.classList.add("hidden");
  running = true;
  ambience.volume = 0.2; ambience.currentTime = 0; ambience.play();
  cancelAnimationFrame(gameLoopId);
  requestAnimationFrame(loop);
}

function placeApple() {
  let excludes = [...snakeParts];
  if (mode === "portal" && portal1 && portal2) excludes.push(portal1, portal2);
  const pos = randomFreeTile(excludes);
  appleX = pos.x; appleY = pos.y;
}

function placePortals() {
  portal1 = randomFreeTile(snakeParts);
  portal2 = randomFreeTile([...snakeParts, portal1]);
}

function drawBoard() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#222"; ctx.lineWidth = 1;
  for (let i = 1; i < tileCnt; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }
}

function distance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function drawSnakeTubeBody() {
  if (snakeParts.length < 2) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--snake');
  ctx.lineWidth = tileSize * 0.85;

  ctx.beginPath();
  for (let i = 0; i < snakeParts.length; i++) {
    let px = snakeParts[i].x * tileSize + tileSize / 2;
    let py = snakeParts[i].y * tileSize + tileSize / 2;

    if (i === 0) ctx.moveTo(px, py);
    else {
      // Prevent drawing over wrap
      let d = distance(snakeParts[i], snakeParts[i - 1]);
      if (d > 2) ctx.moveTo(px, py); // break line
      else ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawSnakeHead() {
  let head = snakeParts[snakeParts.length - 1];
  let hx = head.x * tileSize + tileSize / 2;
  let hy = head.y * tileSize + tileSize / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(hx, hy, tileSize * 0.435, 0, Math.PI * 2);
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--head');
  ctx.shadowColor = "#fff857";
  ctx.shadowBlur = 7;
  ctx.fill();

  // Eyes
  ctx.beginPath();
  ctx.arc(hx - tileSize * 0.11, hy - tileSize * 0.14, tileSize * 0.07, 0, Math.PI*2);
  ctx.arc(hx + tileSize * 0.14, hy - tileSize * 0.14, tileSize * 0.07, 0, Math.PI*2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Pupils
  ctx.beginPath();
  ctx.arc(hx - tileSize * 0.11 + velX * 2.5, hy - tileSize * 0.14 + velY * 2.5, tileSize * 0.03, 0, Math.PI*2);
  ctx.arc(hx + tileSize * 0.14 + velX * 2.5, hy - tileSize * 0.14 + velY * 2.5, tileSize * 0.03, 0, Math.PI*2);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.restore();
}

function draw() {
  drawBoard();

  ctx.beginPath();
  ctx.arc(appleX * tileSize + tileSize / 2, appleY * tileSize + tileSize / 2, tileSize * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  if (mode === "portal" && portal1 && portal2) {
    ctx.beginPath();
    ctx.arc(portal1.x * tileSize + tileSize / 2, portal1.y * tileSize + tileSize / 2, tileSize * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = "#9047ff"; ctx.fill();
    ctx.beginPath();
    ctx.arc(portal2.x * tileSize + tileSize / 2, portal2.y * tileSize + tileSize / 2, tileSize * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = "#36d1ff"; ctx.fill();
  }

  drawSnakeTubeBody();
  drawSnakeHead();
}

function checkGameOver() {
  if (!running) return false;
  if ((headX < 0 || headX >= tileCnt || headY < 0 || headY >= tileCnt) && mode !== "nowall" && mode !== "portal") return true;
  for (let i = 0; i < snakeParts.length - 2; i++) {
    if (snakeParts[i].x === headX && snakeParts[i].y === headY) return true;
  }
  return false;
}

function gameOver() {
  running = false;
  crashS.play();
  ambience.pause();
  overlayTxt.textContent = "Game Over!";
  overlay.classList.remove("hidden");
}

function loop(ts) {
  gameLoopId = requestAnimationFrame(loop);
  if (!running) return;
  if (ts - lastTime < 1000 / speed) return;
  lastTime = ts;

  if (velX === 0 && velY === 0) {
    draw();
    return;
  }

  headX += velX;
  headY += velY;

  if (mode === "nowall") {
    headX = (headX + tileCnt) % tileCnt;
    headY = (headY + tileCnt) % tileCnt;
  }

  if (mode === "portal") {
    headX = Math.max(0, Math.min(tileCnt - 1, headX));
    headY = Math.max(0, Math.min(tileCnt - 1, headY));
  }

  snakeParts.push({ x: headX, y: headY });
  while (snakeParts.length > tailLen) snakeParts.shift();

  if (headX === appleX && headY === appleY) {
    eatS.play();
    tailLen++;
    score++;
    scoreSpan.textContent = score;
    placeApple();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", score);
      highScoreSpan.textContent = score;
    }
    if (score % 5 === 0) speed++;
  }

  draw();
  if (checkGameOver()) gameOver();
}

function applySkin(name) {
  canvas.classList.remove("retro", "night", "neon");
  canvas.classList.add(name);
}

modeBtns.forEach(btn => {
  btn.onclick = () => {
    clickS.play();
    mode = btn.dataset.mode;
    localStorage.setItem("mode", mode);
    selectModeSkin();
  };
});

skinBtns.forEach(btn => {
  btn.onclick = () => {
    clickS.play();
    skin = btn.dataset.skin;
    localStorage.setItem("skin", skin);
    applySkin(skin);
    selectModeSkin();
  };
});

playBtn.onclick = restartBtn.onclick = () => {
  clickS.play();
  newGame();
  canvas.focus();
};

document.addEventListener("keydown", e => {
  if (!running) return;
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (velY !== 1) { velX = 0; velY = -1; turnS.play(); }
      break;
    case "ArrowDown":
    case "s":
      if (velY !== -1) { velX = 0; velY = 1; turnS.play(); }
      break;
    case "ArrowLeft":
    case "a":
      if (velX !== 1) { velX = -1; velY = 0; turnS.play(); }
      break;
    case "ArrowRight":
    case "d":
      if (velX !== -1) { velX = 1; velY = 0; turnS.play(); }
      break;
  }
});

arrowPad.addEventListener("click", e => {
  if (!running || !e.target.dataset.dir) return;
  const dir = e.target.dataset.dir;
  if (dir === "up" && velY !== 1) { velX = 0; velY = -1; turnS.play(); }
  else if (dir === "down" && velY !== -1) { velX = 0; velY = 1; turnS.play(); }
  else if (dir === "left" && velX !== 1) { velX = -1; velY = 0; turnS.play(); }
  else if (dir === "right" && velX !== -1) { velX = 1; velY = 0; turnS.play(); }
  canvas.focus();
});

canvas.addEventListener("touchstart", () => canvas.focus());
