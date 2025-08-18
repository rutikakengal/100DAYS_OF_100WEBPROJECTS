
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
// Data for phrases and science facts
const phrases = [
    "Reality mutates with perception",
    "The universe is a cosmic echo chamber",
    "Change is the only constant",
    "Digital evolution never sleeps",
    "Code is the DNA of the future",
    "Every refresh rewrites existence",
    "The web is our collective consciousness",
    "Algorithms shape our reality",
    "Data is the new mythology",
    "The screen is our window to alternate dimensions",
    "Quantum fluctuations in the digital realm",
    "The observer affects the observed",
    "Information wants to be free and mutate",
    "We are all nodes in the network",
    "The singularity is a state of mind",
    "Reality is a user interface",
    "Consciousness is a recursive algorithm",
    "The future is probabilistic",
    "Digital physics governs our existence",
    "The matrix is self-modifying",
    "Perception creates reality",
    "Code is law in the digital cosmos",
    "The internet is our extended mind",
    "Virtual particles populate the web",
    "Reality renders in real-time",
    "The cloud is our collective memory",
    "AI is the next step in evolution",
    "The browser is our portal to the multiverse",
    "Data streams shape our worldview",
    "The digital and physical are entangled",
    "Reality is a dynamic system",
    "Information is the fundamental substance",
    "The web is alive with possibilities",
    "Every click creates a parallel universe",
    "The digital realm is infinite",
    "We are all avatars in the simulation",
    "The internet remembers what we forget",
    "Algorithms are the new gods",
    "Data patterns reveal hidden truths",
    "The network is conscious",
    "Digital evolution outpaces biological",
    "Reality is a collaborative construct",
    "The future is already here, just unevenly distributed",
    "Code is poetry that creates worlds",
    "The web is our shared dreamspace",
    "Information wants to become experience",
    "The digital frontier is limitless",
    "Every mutation reveals new possibilities",
    "The network is the computer",
    "We are the architects of our digital reality"
];

const scienceFacts = [
    "The human brain processes about 70,000 thoughts each day",
    "There are more possible iterations of a game of chess than atoms in the known universe",
    "A single bolt of lightning contains enough energy to toast 100,000 slices of bread",
    "The average cloud weighs about 1.1 million pounds",
    "Honey never spoils - archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible",
    "The Earth's core is as hot as the surface of the sun",
    "There are more trees on Earth than stars in our galaxy",
    "A day on Venus is longer than a year on Venus",
    "The Great Pyramid of Giza can expand and contract up to 2.5 cm due to temperature changes",
    "Neutron stars are so dense that a teaspoonful would weigh about 10 million tons",
    "The human body contains enough carbon to fill about 9,000 pencils",
    "Light takes about 8 minutes to travel from the Sun to Earth, but over 100,000 years to travel from the Sun's core to its surface",
    "There are more bacteria in your mouth than there are people on Earth",
    "A single strand of spider silk is stronger than a steel wire of the same thickness",
    "The smell of freshly cut grass is actually a plant distress call",
    "Octopuses have three hearts, nine brains, and blue blood",
    "The coldest temperature ever recorded on Earth was -128.6°F (-89.2°C) in Antarctica",
    "A lightning bolt can reach temperatures of about 30,000 kelvins (53,540 degrees Fahrenheit)",
    "The total weight of all the ants on Earth is about equal to the total weight of all the humans",
    "The Earth's rotation is gradually slowing at about 17 milliseconds per hundred years",
    "There's enough gold in Earth's core to coat the entire surface of the planet in 1.5 feet of gold",
    "The average person will walk the equivalent of five times around the Earth in their lifetime",
    "A single cubic inch of human bone can bear the weight of five standard pickup trucks",
    "The deepest part of the ocean is nearly 7 miles deep (Mariana Trench)",
    "The Sun makes up 99.86% of the mass of our solar system",
    "There are more atoms in a glass of water than glasses of water in all the oceans on Earth",
    "The human eye can distinguish about 10 million different colors",
    "A day on Mercury lasts about 1,408 hours (58.6 Earth days)",
    "The Earth's magnetic field is what causes compasses to point north",
    "The speed of light is about 186,282 miles per second (299,792 kilometers per second)",
    "The human body produces about 25 million new cells each second",
    "The Milky Way galaxy is on a collision course with the Andromeda galaxy",
    "A single raindrop falling at terminal velocity takes about 2 minutes to reach the ground from a cloud",
    "The average person will produce about 25,000 quarts of saliva in their lifetime",
    "The Earth's atmosphere is about 300 miles (480 kilometers) thick",
    "The largest known star (UY Scuti) is about 1,700 times larger than our Sun",
    "The human brain uses about 20% of the body's energy but makes up only 2% of the body's weight",
    "A neutron star's gravity is so strong that it can bend light around itself",
    "The total length of all the blood vessels in the human body is about 60,000 miles",
    "The Moon is moving away from Earth at a rate of about 1.5 inches (3.8 cm) per year",
    "The average cumulus cloud weighs about 1.1 million pounds (500,000 kg)",
    "The Earth's inner core spins at a different speed than the rest of the planet",
    "A single hydrogen atom takes about 40 million years to travel from the Sun's core to its surface",
    "The human nose can detect about 1 trillion different odors",
    "The coldest known place in the universe is the Boomerang Nebula at -457.6°F (-272°C)",
    "The Earth gains about 40,000 tons of dust each year from space",
    "The human heart creates enough pressure to squirt blood 30 feet",
    "The total energy output of the Sun in one second is enough to power human civilization for 500,000 years",
    "The average person will spend about 25 years asleep in their lifetime",
    "The Great Barrier Reef is the largest living structure on Earth, visible from space"
];

// Badge achievements data
const achievements = [
    { level: 5, title: "Novice Mutator", desc: "Changed reality 5 times" },
    { level: 10, title: "Reality Shaper", desc: "Changed reality 10 times" },
    { level: 15, title: "Dimension Hopper", desc: "Changed reality 15 times" },
    { level: 20, title: "Quantum Explorer", desc: "Changed reality 20 times" },
    { level: 25, title: "Cosmic Weaver", desc: "Changed reality 25 times" },
    { level: 30, title: "Multiverse Traveler", desc: "Changed reality 30 times" },
    { level: 35, title: "Reality Architect", desc: "Changed reality 35 times" },
    { level: 40, title: "Universal Designer", desc: "Changed reality 40 times" },
    { level: 45, title: "Omniversal Being", desc: "Changed reality 45 times" },
    { level: 50, title: "ULTIMATE PROFESSIONAL UNEMPLOYED", desc: "Mastered all realities" }
];

// Update your mutationStyles array in script.js to include all 50 styles
const mutationStyles = [
    'style-1', 'style-2', 'style-3', 'style-4', 'style-5',
    'style-6', 'style-7', 'style-8', 'style-9', 'style-10',
    'style-11', 'style-12', 'style-13', 'style-14', 'style-15',
    'style-16', 'style-17', 'style-18', 'style-19', 'style-20',
    'style-21', 'style-22', 'style-23', 'style-24', 'style-25',
    'style-26', 'style-27', 'style-28', 'style-29', 'style-30',
    'style-31', 'style-32', 'style-33', 'style-34', 'style-35',
    'style-36', 'style-37', 'style-38', 'style-39', 'style-40',
    'style-41', 'style-42', 'style-43', 'style-44', 'style-45',
    'style-46', 'style-47', 'style-48', 'style-49', 'style-50'
];

// DOM elements
const reloadBtn = document.getElementById('reloadBtn');
const badgesContainer = document.getElementById('badgesContainer');
const cardsContainer = document.getElementById('cardsContainer');
const clickCountDisplay = document.getElementById('clickCount');
const body = document.body;

// State
let clickCount = 0;
let shownPhrases = [];
let shownFacts = [];
function createParticles() {
    const particles = 50;
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            opacity: ${Math.random() * 0.5 + 0.1};
            background: var(--accent-color);
        `;
        document.body.appendChild(particle);
    }
}

// Call it in init():
function init() {
    createParticles();
    // ... rest of your init code
}

// Initialize
function init() {
    updateBadges();
    updateClickCount();
}

// Update click count display
function updateClickCount() {
    clickCountDisplay.textContent = clickCount;
}

// Generate cards for current click
function generateCards() {
    cardsContainer.innerHTML = '';
    
    // Get current phrase and fact based on click count
    const phrase = phrases[clickCount % phrases.length];
    const fact = scienceFacts[clickCount % scienceFacts.length];
    
    // Create cards
    createCard(phrase, 'Philosophical Echo');
    createCard(fact, 'Science Fact');
}

// Create a single card
function createCard(content, title) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const cardTitle = document.createElement('h3');
    cardTitle.className = 'card-title';
    cardTitle.textContent = title;
    
    const cardContent = document.createElement('p');
    cardContent.className = 'card-content';
    cardContent.textContent = content;
    
    card.appendChild(cardTitle);
    card.appendChild(cardContent);
    
    // Random delay for animation
    const delay = Math.random() * 0.5;
    card.style.animationDelay = `${delay}s`;
    
    cardsContainer.appendChild(card);
}

// Update badges display
function updateBadges() {
    badgesContainer.innerHTML = '';
    const badgesToShow = Math.min(50, Math.floor(clickCount / 5) * 5);
    
    for (let i = 0; i < 50; i++) {
        const badge = document.createElement('div');
        const isSpecial = (i + 1) % 10 === 0;
        const isUltimate = (i + 1) === 50;
        
        badge.className = `badge ${i < badgesToShow ? 'unlocked' : ''} ${isSpecial ? 'special' : ''} ${isUltimate ? 'ultimate' : ''}`;
        badge.textContent = i + 1;
        badgesContainer.appendChild(badge);
    }
}

// Show achievement notification
function showAchievement(title, desc) {
    const notification = document.querySelector('.achievement-notification');
    notification.querySelector('.achievement-title').textContent = title;
    notification.querySelector('.achievement-desc').textContent = desc;
    
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Check for achievements
function checkAchievements() {
    const achievement = achievements.find(a => a.level === clickCount);
    if (achievement) {
        showAchievement(achievement.title, achievement.desc);
    }
}

// Mutate the website
function mutate() {
    if (clickCount >= 50) return;
    
    clickCount++;
    // Add right after clickCount++
const counter = document.getElementById('clickCount');
counter.classList.remove('bounce');
void counter.offsetWidth; // Trigger reflow
counter.classList.add('bounce');
    
    // Change style every click
    const styleIndex = clickCount % mutationStyles.length;
    body.className = mutationStyles[styleIndex];
    
    // Generate new cards
    generateCards();
    
    // Update badges every 5 clicks
    if (clickCount % 5 === 0) {
        updateBadges();
        checkAchievements();
    }
    
    // Update click count display
    updateClickCount();
    
    // Button animation
    reloadBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        reloadBtn.style.transform = 'scale(1)';
    }, 100);
    
    // Special handling for 50th click
    if (clickCount === 50) {
        reloadBtn.textContent = "Reality Mastered";
        reloadBtn.style.background = "linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)";
        reloadBtn.style.boxShadow = "0 0 20px #c471ed";
    }
}

// Event listeners
reloadBtn.addEventListener('click', mutate);

// Initialize on load
window.addEventListener('load', init);

