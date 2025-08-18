

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
=======
window.addEventListener('load', () => {
    // --- DOM ELEMENTS ---
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    
    // Tool & Action Buttons
    const pencilBtn = document.getElementById('pencil-btn');
    const eraserBtn = document.getElementById('eraser-btn');
    const clearBtn = document.getElementById('clear-btn');
    const savePngBtn = document.getElementById('save-png-btn');
    const savePdfBtn = document.getElementById('save-pdf-btn');

    // Brush Shape Buttons
    const brushRoundBtn = document.getElementById('brush-round-btn');
    const brushCircleBtn = document.getElementById('brush-circle-btn');
    const brushSquareBtn = document.getElementById('brush-square-btn');
    
    // Other Controls
    const sizeSlider = document.getElementById('size-slider');
    const sizeDisplay = document.getElementById('size-display');
    const colorPicker = document.getElementById('color-picker');

    // --- STATE ---
    let isDrawing = false;
    let isErasing = false;
    let brushWidth = 5;
    let brushColor = '#000000';
    let brushShape = 'round'; // 'round', 'circle', or 'square'
    let lastX = 0;
    let lastY = 0;

    // --- HELPER FUNCTIONS ---

    // Gets correct coordinates for both mouse and touch events
    function getCoordinates(event) {
        const rect = canvas.getBoundingClientRect();
        if (event.touches) {
            return [event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top];
        }
        return [event.clientX - rect.left, event.clientY - rect.top];

    }

    // Prepares canvas data URL with a white background for saving
    function getCanvasDataWithBackground() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Fill background with white
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the current canvas content on top
        tempCtx.drawImage(canvas, 0, 0);
        
        return tempCanvas.toDataURL('image/png');
    }

    // --- CORE DRAWING FUNCTION ---
    function draw(event) {
        if (!isDrawing) return;
        event.preventDefault(); 

        const [currentX, currentY] = getCoordinates(event);
        
        ctx.fillStyle = brushColor;
        ctx.strokeStyle = brushColor;
        
        // Eraser logic is separate and overrides brush settings
        if (isErasing) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = brushWidth * 4; // Make eraser bigger
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        } else {
            ctx.globalCompositeOperation = 'source-over';
            
            // Calculate distance and angle for smooth stamping
            const dist = Math.sqrt((currentX - lastX)**2 + (currentY - lastY)**2);
            const angle = Math.atan2(currentY - lastY, currentX - lastX);

            for (let i = 0; i < dist; i++) {
                const x = lastX + i * Math.cos(angle);
                const y = lastY + i * Math.sin(angle);

                // Draw based on the selected brush shape
                switch (brushShape) {
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(x, y, brushWidth / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 'square':
                        ctx.fillRect(x - brushWidth / 2, y - brushWidth / 2, brushWidth, brushWidth);
                        break;
                    case 'round': // The default line brush
                    default:
                        ctx.lineWidth = brushWidth;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.beginPath();
                        ctx.moveTo(lastX, lastY);
                        ctx.lineTo(currentX, currentY);
                        ctx.stroke();
                        i = dist; // Break the loop for line brush to avoid overdrawing
                        break;
                }
            }
        }
        [lastX, lastY] = [currentX, currentY];
    }

    // --- EVENT HANDLERS ---
    const startDrawing = (event) => {
        event.preventDefault();
        isDrawing = true;
        [lastX, lastY] = getCoordinates(event);
    };

    const stopDrawing = () => {
        isDrawing = false;
    };

    const handleSizeChange = (event) => {
        brushWidth = event.target.value;
        sizeDisplay.textContent = brushWidth;
    };
    
    const handleColorChange = (event) => {
        brushColor = event.target.value;
    };

    const handleClearCanvas = () => {
        if (window.confirm("Are you sure you want to clear the canvas? This action cannot be undone.")) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleSavePNG = () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = getCanvasDataWithBackground();
        link.click();
    };

    const handleSavePDF = () => {
        const { jsPDF } = window.jspdf;
        const imgData = getCanvasDataWithBackground();
        
        const orientation = canvas.width > canvas.height ? 'l' : 'p';
        const pdf = new jsPDF(orientation, 'px', [canvas.width, canvas.height]);
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('drawing.pdf');
    };
    
    // --- UI & TOOL SELECTION ---
    function selectPencil() {
        isErasing = false;
        pencilBtn.classList.add('ring-2', 'ring-blue-700');
        eraserBtn.classList.remove('ring-2', 'ring-slate-700');
    }

    function selectEraser() {
        isErasing = true;
        eraserBtn.classList.add('ring-2', 'ring-slate-700');
        pencilBtn.classList.remove('ring-2', 'ring-blue-700');
    }

    function selectBrush(shape) {
        brushShape = shape;
        // Update UI to show active brush
        [brushRoundBtn, brushCircleBtn, brushSquareBtn].forEach(btn => {
            btn.classList.remove('ring-2', 'ring-blue-500');
        });
        document.getElementById(`brush-${shape}-btn`).classList.add('ring-2', 'ring-blue-500');
    }

    // --- CANVAS SIZING ---
    function resizeCanvas() {
        const parent = canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        
        // Save drawing to restore it after resize
        const currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        
        // Restore the drawing
        ctx.putImageData(currentDrawing, 0, 0);
    }


drawEverything();


    // --- INITIALIZATION ---
    resizeCanvas();
    selectPencil();
    selectBrush('round');

    // --- EVENT LISTENERS ---
    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    
    // Control events
    window.addEventListener('resize', resizeCanvas);
    pencilBtn.addEventListener('click', selectPencil);
    eraserBtn.addEventListener('click', selectEraser);
    clearBtn.addEventListener('click', handleClearCanvas);
    sizeSlider.addEventListener('input', handleSizeChange);
    colorPicker.addEventListener('input', handleColorChange);
    savePngBtn.addEventListener('click', handleSavePNG);
    savePdfBtn.addEventListener('click', handleSavePDF);

    // Brush selection listeners
    brushRoundBtn.addEventListener('click', () => selectBrush('round'));
    brushCircleBtn.addEventListener('click', () => selectBrush('circle'));
    brushSquareBtn.addEventListener('click', () => selectBrush('square'));
});

