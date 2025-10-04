document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const generateBtn = document.getElementById('generate-btn');
    const messageArea = document.getElementById('message-area');
    const N = 9;
    const cells = [];

    for (let i = 0; i < N; i++) {
        const row = [];
        for (let j = 0; j < N; j++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.className = 'sudoku-cell';
            cell.min = 1;
            cell.max = 9;
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('input', () => {
                if (cell.value.length > 1) cell.value = cell.value.slice(0, 1);
            });

            cell.addEventListener('keydown', (e) => handleArrowNavigation(e, i, j));

            row.push(cell);
            boardElement.appendChild(cell);
        }
        cells.push(row);
    }

    const puzzles = [
        "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79",
        "..9748...7.........2.1.9...6..5.7.8...3...2...1.5.4..3...4.2.7.........9...3628..",
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......",
        "8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4.."
    ];

    solveBtn.addEventListener('click', solveSudoku);
    clearBtn.addEventListener('click', clearBoard);
    generateBtn.addEventListener('click', generatePuzzle);

    function clearBoard(showMsg = true) {
        cells.forEach(row => row.forEach(cell => {
            cell.value = '';
            cell.classList.remove('pre-filled', 'solution-cell', 'invalid-cell');
            cell.disabled = false;
        }));
        if (showMsg) showMessage("Board cleared.");
    }

    function generatePuzzle() {
        clearBoard(false);
        const puzzleString = puzzles[Math.floor(Math.random() * puzzles.length)];
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const char = puzzleString[i * N + j];
                if (char !== '.') {
                    cells[i][j].value = char;
                    cells[i][j].classList.add('pre-filled');
                    cells[i][j].disabled = true;
                }
            }
        }
        showMessage("New puzzle generated.");
    }

    function getBoardState() {
        return cells.map(row => row.map(cell => cell.value ? parseInt(cell.value, 10) : 0));
    }

    function showMessage(msg, duration = 2000) {
        messageArea.textContent = msg;
        setTimeout(() => messageArea.textContent = '', duration);
    }

    function toggleControls(enabled) {
        [solveBtn, clearBtn, generateBtn].forEach(btn => btn.disabled = !enabled);
    }

    function handleArrowNavigation(e, row, col) {
        let newRow = row, newCol = col;
        switch(e.key) {
            case 'ArrowUp': if(row > 0) newRow--; break;
            case 'ArrowDown': if(row < N - 1) newRow++; break;
            case 'ArrowLeft': if(col > 0) newCol--; break;
            case 'ArrowRight': if(col < N - 1) newCol++; break;
            default: return;
        }
        cells[newRow][newCol].focus();
    }

    function solveSudoku() {
        cells.forEach(row => row.forEach(cell => cell.classList.remove('invalid-cell', 'solution-cell')));
        
        const initialBoard = getBoardState();
        if (!isBoardValid(initialBoard)) {
            showMessage("Invalid numbers on the board.", 3000);
            boardElement.classList.add('shake-board');
            setTimeout(() => boardElement.classList.remove('shake-board'), 500);
            return;
        }

        const board = JSON.parse(JSON.stringify(initialBoard));
        toggleControls(false);
        showMessage('Solving...', 5000);

        setTimeout(() => {
            if (solve(board)) {
                showMessage('Puzzle Solved!', 3000);
                for (let r = 0; r < N; r++) {
                    for (let c = 0; c < N; c++) {
                        if (initialBoard[r][c] === 0) {
                            cells[r][c].value = board[r][c];
                            cells[r][c].classList.add('solution-cell');
                        }
                    }
                }
            } else {
                showMessage("This puzzle is unsolvable.", 3000);
                boardElement.classList.add('shake-board');
                setTimeout(() => boardElement.classList.remove('shake-board'), 500);
            }
            toggleControls(true);
        }, 50);
    }

    function findEmpty(board) {
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                if (board[r][c] === 0) return [r, c];
            }
        }
        return null;
    }

    function isValidPlacement(board, num, pos) {
        const [r, c] = pos;
        for (let i = 0; i < N; i++) if (board[r][i] === num && c !== i) return false;
        for (let i = 0; i < N; i++) if (board[i][c] === num && r !== i) return false;
        const boxX = Math.floor(c / 3) * 3;
        const boxY = Math.floor(r / 3) * 3;
        for (let i = boxY; i < boxY + 3; i++) {
            for (let j = boxX; j < boxX + 3; j++) {
                if (board[i][j] === num && (i !== r || j !== c)) return false;
            }
        }
        return true;
    }

    function isBoardValid(board) {
        let isValid = true;
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                if (board[r][c] === 0) continue;
                const val = board[r][c];
                board[r][c] = 0;
                if (!isValidPlacement(board, val, [r, c])) {
                    cells[r][c].classList.add('invalid-cell');
                    isValid = false;
                }
                board[r][c] = val;
            }
        }
        return isValid;
    }

    function solve(board) {
        const find = findEmpty(board);
        if (!find) return true;
        
        const [r, c] = find;
        for (let i = 1; i <= 9; i++) {
            if (isValidPlacement(board, i, [r, c])) {
                board[r][c] = i;
                if (solve(board)) return true;
                board[r][c] = 0;
            }
        }
        return false;
    }

    generatePuzzle();
});