document.addEventListener('DOMContentLoaded', () => {
    // Mode selection screen elements
    const modeSelectionScreen = document.getElementById('mode-selection');
    const playerVsPlayerBtn = document.getElementById('player-vs-player');
    const playerVsComputerBtn = document.getElementById('player-vs-computer');

    // Game screen elements
    const gameScreen = document.getElementById('game-screen');
    const statusMessage = document.getElementById('status-message');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart-button');

    let gameActive = false;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameMode = ''; // 'PvP' or 'PvC'

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // --- Mode Selection and Initialization ---

    playerVsPlayerBtn.addEventListener('click', () => startGame('PvP'));
    playerVsComputerBtn.addEventListener('click', () => startGame('PvC'));
    restartButton.addEventListener('click', restartGame);

    function startGame(mode) {
        gameMode = mode;
        modeSelectionScreen.classList.remove('active');
        gameScreen.classList.add('active');
        gameActive = true;
        currentPlayer = 'X';
        statusMessage.innerHTML = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    }

    // --- Game Logic Functions ---

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'x-player' : 'o-player');
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.innerHTML = `Player ${currentPlayer}'s turn`;

        if (gameMode === 'PvC' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 300); 
            // Give a slight delay for a better user experience
        }
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusMessage.innerHTML = `Player ${currentPlayer} has won! 🥳`;
            gameActive = false;
            return;
        }
        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusMessage.innerHTML = `Game ended in a draw! 😐`;
            gameActive = false;
            return;
        }
        handlePlayerChange();
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive || (gameMode === 'PvC' && currentPlayer === 'O')) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function restartGame() {
        gameActive = false;
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x-player', 'o-player');
            cell.removeEventListener('click', handleCellClick);
        });
        
        // Show mode selection screen again
        gameScreen.classList.remove('active');
        modeSelectionScreen.classList.add('active');
    }

    // --- Computer Logic ---

    function computerMove() {
        const availableCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        
        if (availableCells.length > 0) {
            // A simple AI: pick a random empty cell
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const computerMoveIndex = availableCells[randomIndex];
            
            const computerCell = cells[computerMoveIndex];
            handleCellPlayed(computerCell, computerMoveIndex);
            handleResultValidation();
        }
    }
});