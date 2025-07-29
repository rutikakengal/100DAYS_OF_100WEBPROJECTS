class HangmanGame {
    constructor() {
        this.words = {
            animals: [
                'ELEPHANT', 'GIRAFFE', 'PENGUIN', 'KANGAROO', 'DOLPHIN',
                'BUTTERFLY', 'RHINOCEROS', 'OSTRICH', 'CHEETAH', 'GORILLA',
                'FLAMINGO', 'HIPPOPOTAMUS', 'ZEBRA', 'PANDA', 'TIGER'
            ],
            countries: [
                'CANADA', 'AUSTRALIA', 'BRAZIL', 'JAPAN', 'EGYPT',
                'ITALY', 'MEXICO', 'INDIA', 'FRANCE', 'SPAIN',
                'GERMANY', 'ENGLAND', 'CHINA', 'RUSSIA', 'ARGENTINA'
            ],
            food: [
                'PIZZA', 'SUSHI', 'BURGER', 'PASTA', 'TACOS',
                'SALAD', 'SANDWICH', 'STEAK', 'CHICKEN', 'FISH',
                'RICE', 'BREAD', 'CHEESE', 'APPLE', 'BANANA'
            ],
            sports: [
                'FOOTBALL', 'BASKETBALL', 'TENNIS', 'SOCCER', 'BASEBALL',
                'VOLLEYBALL', 'HOCKEY', 'GOLF', 'SWIMMING', 'RUNNING',
                'BOXING', 'WRESTLING', 'SKIING', 'SURFING', 'CYCLING'
            ],
            colors: [
                'RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE',
                'ORANGE', 'PINK', 'BROWN', 'BLACK', 'WHITE',
                'GRAY', 'GOLD', 'SILVER', 'TEAL', 'MAROON'
            ]
        };
        
        this.currentWord = '';
        this.currentCategory = '';
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        this.gameWon = 0;
        this.gameLost = 0;
        this.gameActive = false;
        
        this.initializeElements();
        this.loadScores();
        this.loadTheme();
        this.createKeyboard();
        this.bindEvents();
        this.startNewGame();
    }
    
    initializeElements() {
        this.wordDisplay = document.getElementById('wordDisplay');
        this.categoryText = document.getElementById('categoryText');
        this.livesDisplay = document.getElementById('lives');
        this.messageDisplay = document.getElementById('message');
        this.winsDisplay = document.getElementById('wins');
        this.lossesDisplay = document.getElementById('losses');
        this.keyboard = document.getElementById('keyboard');
        this.modal = document.getElementById('gameOverModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        
        // Hangman body parts
        this.hangmanParts = {
            head: document.getElementById('head'),
            body: document.getElementById('body'),
            leftArm: document.getElementById('leftArm'),
            rightArm: document.getElementById('rightArm'),
            leftLeg: document.getElementById('leftLeg'),
            rightLeg: document.getElementById('rightLeg')
        };
    }
    
    loadScores() {
        this.gameWon = parseInt(localStorage.getItem('hangmanWins')) || 0;
        this.gameLost = parseInt(localStorage.getItem('hangmanLosses')) || 0;
        this.updateScoreDisplay();
    }
    
    saveScores() {
        localStorage.setItem('hangmanWins', this.gameWon.toString());
        localStorage.setItem('hangmanLosses', this.gameLost.toString());
    }
    
    updateScoreDisplay() {
        this.winsDisplay.textContent = this.gameWon;
        this.lossesDisplay.textContent = this.gameLost;
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('hangmanTheme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('hangmanTheme', newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to light mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to dark mode';
        }
    }
    
    createKeyboard() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.keyboard.innerHTML = '';
        
        letters.split('').forEach(letter => {
            const key = document.createElement('button');
            key.className = 'key';
            key.textContent = letter;
            key.dataset.letter = letter;
            key.addEventListener('click', () => this.guessLetter(letter));
            this.keyboard.appendChild(key);
        });
    }
    
    bindEvents() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('hintBtn').addEventListener('click', () => this.giveHint());
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.closeModal();
            this.startNewGame();
        });
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key) && !this.guessedLetters.has(key)) {
                this.guessLetter(key);
            }
        });
    }
    
    startNewGame() {
        this.gameActive = true;
        this.guessedLetters.clear();
        this.wrongGuesses = 0;
        
        // Select random category and word
        const categories = Object.keys(this.words);
        this.currentCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryWords = this.words[this.currentCategory];
        this.currentWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        
        this.updateDisplay();
        this.resetHangman();
        this.resetKeyboard();
        this.showMessage('Guess the word!');
    }
    
    updateDisplay() {
        // Update word display
        const displayWord = this.currentWord.split('').map(letter => 
            this.guessedLetters.has(letter) ? letter : '_'
        ).join(' ');
        
        this.wordDisplay.textContent = displayWord;
        this.categoryText.textContent = this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
        this.livesDisplay.textContent = this.maxWrongGuesses - this.wrongGuesses;
    }
    
    resetHangman() {
        Object.values(this.hangmanParts).forEach(part => {
            part.style.opacity = '0';
        });
    }
    
    resetKeyboard() {
        const keys = this.keyboard.querySelectorAll('.key');
        keys.forEach(key => {
            key.disabled = false;
            key.classList.remove('correct', 'incorrect');
        });
    }
    
    guessLetter(letter) {
        if (!this.gameActive || this.guessedLetters.has(letter)) return;
        
        this.guessedLetters.add(letter);
        const key = this.keyboard.querySelector(`[data-letter="${letter}"]`);
        
        if (this.currentWord.includes(letter)) {
            // Correct guess
            key.classList.add('correct');
            key.disabled = true;
            this.showMessage('Great guess!');
            
            // Check if word is complete
            if (this.isWordComplete()) {
                this.gameWon++;
                this.saveScores();
                this.updateScoreDisplay();
                this.endGame(true);
            }
        } else {
            // Wrong guess
            key.classList.add('incorrect');
            key.disabled = true;
            this.wrongGuesses++;
            this.updateHangman();
            this.showMessage('Wrong guess!');
            
            if (this.wrongGuesses >= this.maxWrongGuesses) {
                this.gameLost++;
                this.saveScores();
                this.updateScoreDisplay();
                this.endGame(false);
            }
        }
        
        this.updateDisplay();
    }
    
    updateHangman() {
        const parts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
        if (this.wrongGuesses <= parts.length) {
            const part = parts[this.wrongGuesses - 1];
            this.hangmanParts[part].style.opacity = '1';
        }
    }
    
    isWordComplete() {
        return this.currentWord.split('').every(letter => this.guessedLetters.has(letter));
    }
    
    giveHint() {
        if (!this.gameActive) return;
        
        const unguessedLetters = this.currentWord.split('').filter(letter => 
            !this.guessedLetters.has(letter)
        );
        
        if (unguessedLetters.length > 0) {
            const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
            this.showMessage(`Hint: The word contains the letter "${randomLetter}"`);
        }
    }
    
    showMessage(message) {
        this.messageDisplay.textContent = message;
        this.messageDisplay.style.animation = 'none';
        setTimeout(() => {
            this.messageDisplay.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
    
    endGame(won) {
        this.gameActive = false;
        
        if (won) {
            this.modalTitle.textContent = 'Congratulations! 🎉';
            this.modalMessage.textContent = `You guessed the word "${this.currentWord}" correctly!`;
        } else {
            this.modalTitle.textContent = 'Game Over! 💀';
            this.modalMessage.textContent = `The word was "${this.currentWord}". Better luck next time!`;
        }
        
        this.showModal();
    }
    
    showModal() {
        this.modal.style.display = 'block';
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }
    
    closeModal() {
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});

// Add some fun animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Add confetti effect for wins
    const addConfetti = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    };
    
    // Add fall animation for confetti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Trigger confetti on win (you can call addConfetti() in the endGame method when won is true)
}); 