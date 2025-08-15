document.addEventListener('DOMContentLoaded', () => {
    const matrix = document.getElementById('matrix');
    const startBtn = document.getElementById('startBtn');
    const soundBtn = document.getElementById('soundBtn');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const bestDisplay = document.getElementById('best');
    
    let sequence = [];
    let userSequence = [];
    let level = 1;
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let soundEnabled = true;
    
    bestDisplay.textContent = bestScore;
    
    // Initialize matrix
    function createMatrix(size) {
        matrix.innerHTML = '';
        matrix.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            matrix.appendChild(cell);
        }
    }
    
    // Generate random sequence
    function generateSequence() {
        sequence = [];
        const size = Math.min(3 + Math.floor(level / 3), 5); // Max 5x5 grid
        createMatrix(size);
        
        const sequenceLength = Math.min(level, size * size);
        for (let i = 0; i < sequenceLength; i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * size * size);
            } while (sequence.includes(randomIndex));
            sequence.push(randomIndex);
        }
    }
    
    // Show sequence to player
    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                return;
            }
            
            const cell = matrix.children[sequence[i]];
            cell.classList.add('active');
            if (soundEnabled) {
                playSound(440 + (i * 100));
            }
            
            setTimeout(() => {
                cell.classList.remove('active');
                i++;
            }, 800);
        }, 1000);
    }
    
    // Handle player input
    function handleCellClick(e) {
        if (sequence.length === 0 || userSequence.length >= sequence.length) return;
        
        const clickedIndex = parseInt(e.target.dataset.index);
        userSequence.push(clickedIndex);
        e.target.classList.add('active');
        
        if (soundEnabled) {
            playSound(440 + (userSequence.length * 50));
        }
        
        setTimeout(() => {
            e.target.classList.remove('active');
            
            // Check if sequence is complete
            if (userSequence.length === sequence.length) {
                checkSequence();
            }
        }, 300);
    }
    
    // Check if player's sequence matches
    function checkSequence() {
        const isCorrect = sequence.every((val, index) => val === userSequence[index]);
        
        if (isCorrect) {
            // Correct sequence
            score += level * 10;
            level++;
            scoreDisplay.textContent = score;
            levelDisplay.textContent = level;
            
            // Show correct feedback
            sequence.forEach(index => {
                const cell = matrix.children[index];
                cell.classList.add('correct');
                setTimeout(() => cell.classList.remove('correct'), 500);
            });
            
            // Next level
            setTimeout(() => {
                userSequence = [];
                generateSequence();
                playSequence();
            }, 1500);
        } else {
            // Wrong sequence
            gameOver();
        }
    }
    
    // Game over handler
    function gameOver() {
        // Show wrong cells
        sequence.forEach((val, index) => {
            if (userSequence[index] !== val) {
                const cell = matrix.children[userSequence[index]];
                if (cell) {
                    cell.classList.add('wrong');
                    setTimeout(() => cell.classList.remove('wrong'), 1000);
                }
            }
        });
        
        // Update best score
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestDisplay.textContent = bestScore;
        }
        
        // Reset game
        setTimeout(() => {
            alert(`Game Over! Your score: ${score}`);
            level = 1;
            score = 0;
            levelDisplay.textContent = level;
            scoreDisplay.textContent = score;
            sequence = [];
            userSequence = [];
            startBtn.textContent = 'Start Game';
        }, 1000);
    }
    
    // Sound functions
    function playSound(frequency) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        
        gainNode.gain.exponentialRampToValueAtTime(
            0.00001, 
            audioCtx.currentTime + 0.5
        );
    }
    
    // Event listeners
    startBtn.addEventListener('click', () => {
        if (sequence.length > 0) return;
        
        startBtn.textContent = 'Playing...';
        generateSequence();
        playSequence();
    });
    
    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
    });
});