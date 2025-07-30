
class SudokuGame {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.givenCells = new Set();
        this.selectedCell = null;
        this.difficulty = 'easy';
        this.startTime = null;
        this.timerInterval = null;
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.createBoard();
        this.generateNewGame();
        this.startTimer();
    }

    createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'cell';
            cell.maxLength = 1;
            cell.dataset.index = i;
            boardElement.appendChild(cell);
        }
    }

    bindEvents() {
        // Cell selection
        document.getElementById('board').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.selectCell(parseInt(e.target.dataset.index));
            }
        });

        // Number pad
        document.getElementById('numberPad').addEventListener('click', (e) => {
            if (e.target.classList.contains('number-btn')) {
                const number = e.target.dataset.number;
                this.inputNumber(number === '0' ? 0 : parseInt(number));
            }
        });

        // Control buttons
        document.getElementById('newGame').addEventListener('click', () => this.generateNewGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.giveHint());
        document.getElementById('checkBtn').addEventListener('click', () => this.checkSolution());
        document.getElementById('solveBtn').addEventListener('click', () => this.solvePuzzle());

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.generateNewGame();
            });
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.selectedCell !== null) {
                if (e.key >= '1' && e.key <= '9') {
                    this.inputNumber(parseInt(e.key));
                } else if (e.key === 'Delete' || e.key === 'Backspace') {
                    this.inputNumber(0);
                }
            }
        });
    }

    selectCell(index) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('selected'));
        
        this.selectedCell = index;
        cells[index].classList.add('selected');
        
        this.highlightRelated(index);
        this.updateStatus('Cell selected. Choose a number or press ✕ to clear.');
    }

    highlightRelated(index) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight-row', 'highlight-col', 'highlight-box');
        });

        const row = Math.floor(index / 9);
        const col = index % 9;
        const boxRow = Math.floor(row / 3);
        const boxCol = Math.floor(col / 3);

        for (let i = 0; i < 81; i++) {
            const cellRow = Math.floor(i / 9);
            const cellCol = i % 9;
            const cellBoxRow = Math.floor(cellRow / 3);
            const cellBoxCol = Math.floor(cellCol / 3);

            if (cellRow === row) cells[i].classList.add('highlight-row');
            if (cellCol === col) cells[i].classList.add('highlight-col');
            if (cellBoxRow === boxRow && cellBoxCol === boxCol) cells[i].classList.add('highlight-box');
        }
    }

    inputNumber(number) {
        if (this.selectedCell === null) {
            this.updateStatus('Please select a cell first.');
            return;
        }

        if (this.givenCells.has(this.selectedCell)) {
            this.updateStatus('Cannot modify given numbers!');
            return;
        }

        const row = Math.floor(this.selectedCell / 9);
        const col = this.selectedCell % 9;
        const cell = document.querySelectorAll('.cell')[this.selectedCell];

        if (number === 0) {
            this.board[row][col] = 0;
            cell.value = '';
            cell.classList.remove('error');
            this.updateStatus('Number cleared.');
        } else {
            if (this.isValidMove(row, col, number)) {
                this.board[row][col] = number;
                cell.value = number;
                cell.classList.remove('error');
                this.updateStatus('Good move!');
                
                if (this.isBoardComplete()) {
                    this.gameWon();
                }
            } else {
                cell.classList.add('error');
                setTimeout(() => cell.classList.remove('error'), 1000);
                this.updateStatus('Invalid move! Check row, column, and 3×3 box.');
            }
        }
    }

    isValidMove(row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (x !== col && this.board[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (x !== row && this.board[x][col] === num) return false;
        }

        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const currentRow = i + startRow;
                const currentCol = j + startCol;
                if (currentRow !== row && currentCol !== col && 
                    this.board[currentRow][currentCol] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    generateNewGame() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.givenCells.clear();
        this.selectedCell = null;

        // Generate a complete valid Sudoku
        this.generateCompleteSudoku();
        
        // Copy solution
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.solution[i][j] = this.board[i][j];
            }
        }

        // Remove numbers based on difficulty
        const cellsToRemove = {
            easy: 40,
            medium: 50,
            hard: 60
        }[this.difficulty];

        const positions = [];
        for (let i = 0; i < 81; i++) positions.push(i);
        
        // Shuffle positions
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        // Remove numbers
        for (let i = 0; i < cellsToRemove; i++) {
            const pos = positions[i];
            const row = Math.floor(pos / 9);
            const col = pos % 9;
            this.board[row][col] = 0;
        }

        // Mark given cells
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] !== 0) {
                    this.givenCells.add(i * 9 + j);
                }
            }
        }

        this.updateDisplay();
        this.startTimer();
        this.updateStatus('New puzzle generated! Good luck!');
    }


    generateCompleteSudoku() {
    this.board = Array(9).fill().map(() => Array(9).fill(0));

    const fill = (row, col) => {
        if (row === 9) return true;
        const nextRow = col === 8 ? row + 1 : row;
        const nextCol = (col + 1) % 9;

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            .sort(() => Math.random() - 0.5);

        for (let num of numbers) {
            if (this.isValidForGeneration(row, col, num)) {
                this.board[row][col] = num;
                if (fill(nextRow, nextCol)) return true;
                this.board[row][col] = 0; 
            }
        }

        return false;
    };

    fill(0, 0);
}


    isValidForGeneration(row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (this.board[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (this.board[x][col] === num) return false;
        }

        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = this.board[row][col];
            
            cell.value = value === 0 ? '' : value;
            cell.classList.remove('given', 'error', 'selected');
            
            if (this.givenCells.has(index)) {
                cell.classList.add('given');
            }
        });
    }

    giveHint() {
        if (this.selectedCell === null) {
            this.updateStatus('Select a cell first to get a hint!');
            return;
        }

        if (this.givenCells.has(this.selectedCell)) {
            this.updateStatus('This number is already given!');
            return;
        }

        const row = Math.floor(this.selectedCell / 9);
        const col = this.selectedCell % 9;
        const correctNumber = this.solution[row][col];
        
        this.board[row][col] = correctNumber;
        const cell = document.querySelectorAll('.cell')[this.selectedCell];
        cell.value = correctNumber;
        cell.classList.remove('error');
        
        this.updateStatus(`Hint: The correct number is ${correctNumber}!`);
        
        if (this.isBoardComplete()) {
            this.gameWon();
        }
    }

    checkSolution() {
        let errors = 0;
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const currentValue = this.board[row][col];
            const correctValue = this.solution[row][col];
            
            cell.classList.remove('error');
            
            if (currentValue !== 0 && currentValue !== correctValue) {
                cell.classList.add('error');
                errors++;
            }
        });

        if (errors === 0) {
            this.updateStatus('Great! All filled numbers are correct!');
        } else {
            this.updateStatus(`Found ${errors} error(s). Check highlighted cells.`);
        }
    }

    solvePuzzle() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = this.solution[i][j];
            }
        }
        this.updateDisplay();
        this.updateStatus('Puzzle solved! Try a new game for more challenge.');
        this.stopTimer();
    }

    isBoardComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) return false;
            }
        }
        return true;
    }

    gameWon() {
        this.updateStatus('🎉 Congratulations! You solved the puzzle! 🎉', true);
        this.stopTimer();
        
        // Add celebration animation
        setTimeout(() => {
            const cells = document.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                setTimeout(() => {
                    cell.style.background = '#4caf50';
                    cell.style.color = 'white';
                }, index * 20);
            });
        }, 500);
    }

    updateStatus(message, isSuccess = false) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = message;
        statusElement.className = isSuccess ? 'status success' : 'status';
    }

    startTimer() {
        this.startTime = Date.now();
        this.stopTimer();
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function(){
    new SudokuGame();
});
=======
const tempEl = document.getElementById("temp-ip-el");
const inputEl = document.getElementById("temp-ip");
const outputEl = document.getElementById("temp-op");
const btnEl = document.getElementById("temp-btn");
const displayEl = document.getElementById("display");
const resetBtn = document.getElementById("reset-btn");

btnEl.addEventListener('click', function(event) {
    event.preventDefault();

    let temp = parseFloat(tempEl.value);
    let input = inputEl.value;
    let output = outputEl.value;

    if (isNaN(temp)) {
        displayEl.textContent = "❌ Please enter a valid number for temperature.";
        return;
    }

    if (input === "0" || output === "0") {
        displayEl.textContent = "⚠️ Please select both input and output temperature units.";
        return;
    }

    let result;

    if (input === output) {
        result = temp;
    } else if (input === "C" && output === "F") {
        result = (temp * 9/5) + 32;
    } else if (input === "F" && output === "C") {
        result = (temp - 32) * 5/9;
    } else if (input === "C" && output === "K") {
        result = temp + 273.15;
    } else if (input === "K" && output === "C") {
        result = temp - 273.15;
    } else if (input === "F" && output === "K") {
        result = (temp - 32) * 5/9 + 273.15;
    } else if (input === "K" && output === "F") {
        result = (temp - 273.15) * 9/5 + 32;
    } else {
        displayEl.textContent = "🚫 Invalid conversion.";
        return;
    }

    let unitSymbol = {
        "C": "°C",
        "F": "°F",
        "K": "K"
    };

    displayEl.textContent = `✅ Converted Temperature: ${result.toFixed(2)} ${unitSymbol[output]}`;
});


resetBtn.addEventListener("click", () => {
  tempEl.value = "";
  inputEl.selectedIndex = 0;
  outputEl.selectedIndex = 0;
  displayEl.textContent = "";
});
 


