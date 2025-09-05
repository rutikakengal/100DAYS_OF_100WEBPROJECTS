// Game variables
const WORDS = [
    "REACT", "CODE", "HTML", "CSS", "JS",
    "NODE", "PYTHON", "JAVA", "RUBY", "GO",
    "RUST", "API", "LOOP", "FUNC", "VAR",
    "LET", "CONST", "CLASS", "IF", "ELSE"
];

let timer = 60;
let score = 0;
let lives = 3;
let comboCount = 0;
let lastHitTime = 0;
let gameOver = false;
let fallSpeed = 1;
let spawnInterval;
let activeElements = [];
let particles = [];
let highScore = localStorage.getItem('typingGameHighScore') || 0;
let difficultyInterval;
let currentInput = "";

// Create stars background
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);

        starsContainer.appendChild(star);
    }
}

// Initialize game
function initGame() {
    createStars();
    updateHighScoreDisplay();
    startGame();
}

// Start game
function startGame() {
    timer = 60;
    score = 0;
    lives = 3;
    comboCount = 0;
    fallSpeed = 1;
    gameOver = false;
    activeElements = [];
    currentInput = "";

    document.querySelector("#scorevalue").textContent = score;
    document.querySelector("#timervalue").textContent = timer;
    document.querySelector("#combovalue").textContent = comboCount;
    document.querySelector("#timervalue").style.color = '#fff';
    document.querySelector("#game-over").style.display = "none";

    updateLivesDisplay();

    // Clear any existing elements and particles
    document.querySelector("#pbtm").innerHTML = "";
    particles.forEach(p => p.element.remove());
    particles = [];

    runTimer();
    startSpawning();
    increaseDifficulty();
}

// Update lives display
function updateLivesDisplay() {
    const livesContainer = document.querySelector("#lives-container");
    livesContainer.innerHTML = "";

    for (let i = 0; i < lives; i++) {
        const life = document.createElement('div');
        life.classList.add('life');
        livesContainer.appendChild(life);
    }
}

// Update high score display
function updateHighScoreDisplay() {
    document.querySelector("#high-score").textContent = `HIGH SCORE: ${highScore}`;
}

// Create particles for explosion effect
function createParticles(x, y, color = '#0ff') {
    const particleCount = 15;
    const pbtm = document.querySelector("#pbtm");

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const hue = color === '#0ff' ? 180 + Math.random() * 30 - 15 : 0 + Math.random() * 30 - 15;
        particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        pbtm.appendChild(particle);
        particles.push({
            element: particle,
            xVel: (Math.random() - 0.5) * 8,
            yVel: (Math.random() - 0.5) * 8,
            life: 30 + Math.random() * 20
        });
    }
}

// Update particles
function updateParticles() {
    particles.forEach((particle, index) => {
        const el = particle.element;
        const left = parseFloat(el.style.left);
        const top = parseFloat(el.style.top);

        el.style.left = `${left + particle.xVel}px`;
        el.style.top = `${top + particle.yVel}px`;

        particle.life--;
        el.style.opacity = particle.life / 50;

        if (particle.life <= 0) {
            el.remove();
            particles.splice(index, 1);
        }
    });
}

// Show combo text
function showCombo(x, y) {
    if (comboCount < 3) return;

    const comboEl = document.createElement('div');
    comboEl.classList.add('combo');
    comboEl.textContent = `${comboCount} COMBO!`;
    comboEl.style.left = `${x}px`;
    comboEl.style.top = `${y}px`;

    document.querySelector("#pbtm").appendChild(comboEl);

    setTimeout(() => {
        comboEl.remove();
    }, 1500);
}

// Increase score with combo multiplier
function increaseScore(value) {
    const now = Date.now();
    const timeDiff = now - lastHitTime;

    if (timeDiff < 2000) { // 2 second combo window
        comboCount++;
    } else {
        comboCount = 1;
    }

    // Letters give 10 points, words give length * 5 points
    const basePoints = typeof value === 'string' ? value.length * 5 : 10;
    const comboMultiplier = Math.min(Math.floor(comboCount / 3) + 1);
    const points = basePoints * comboMultiplier;

    score += points;
    document.querySelector("#scorevalue").textContent = score;
    document.querySelector("#combovalue").textContent = comboCount;
    lastHitTime = now;

    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('typingGameHighScore', highScore);
        updateHighScoreDisplay();
    }
}

// Start spawning letters and words
function startSpawning() {
    if (spawnInterval) clearInterval(spawnInterval);

    spawnInterval = setInterval(() => {
        if (!gameOver) {
            // Randomly decide whether to spawn a letter or word (70% letter, 30% word)
            if (Math.random() < 0.7) {
                spawnLetter();
            } else {
                spawnWord();
            }
        }
    }, 1000); // Spawn every second
}

// Spawn a single letter
function spawnLetter() {
    const pbtm = document.querySelector("#pbtm");
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z

    const letterEl = document.createElement('div');
    letterEl.classList.add('letter');
    letterEl.textContent = letter;
    letterEl.dataset.value = letter;

    // Position in one of 5 lanes
    const laneWidth = pbtm.clientWidth / 5;
    const lane = Math.floor(Math.random() * 5);
    const left = lane * laneWidth + (Math.random() * laneWidth - 20);

    letterEl.style.left = `${Math.max(10, left)}px`;
    letterEl.style.top = '0px';

    pbtm.appendChild(letterEl);

    const elementObj = {
        element: letterEl,
        value: letter,
        y: 0,
        lane: lane,
        speed: fallSpeed * (0.8 + Math.random() * 0.4),
        isWord: false
    };

    activeElements.push(elementObj);

    // Start falling animation
    const fall = () => {
        if (gameOver) return;

        elementObj.y += elementObj.speed;
        letterEl.style.top = `${elementObj.y}px`;

        // Check if reached bottom
        if (elementObj.y > pbtm.clientHeight - 40) {
            removeElement(elementObj, false);
            loseLife();
        } else {
            requestAnimationFrame(fall);
        }

        updateParticles();
    };

    requestAnimationFrame(fall);
}

// Spawn a word
function spawnWord() {
    const pbtm = document.querySelector("#pbtm");
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];

    const wordEl = document.createElement('div');
    wordEl.classList.add('word');
    wordEl.textContent = word;
    wordEl.dataset.value = word;

    // Position in one of 5 lanes
    const laneWidth = pbtm.clientWidth / 5;
    const lane = Math.floor(Math.random() * 5);
    const left = lane * laneWidth + (Math.random() * laneWidth - wordEl.clientWidth);

    wordEl.style.left = `${Math.max(10, left)}px`;
    wordEl.style.top = '0px';

    pbtm.appendChild(wordEl);

    const elementObj = {
        element: wordEl,
        value: word,
        y: 0,
        lane: lane,
        speed: fallSpeed * (0.6 + Math.random() * 0.4), // Words fall slightly slower
        isWord: true
    };

    activeElements.push(elementObj);

    // Start falling animation
    const fall = () => {
        if (gameOver) return;

        elementObj.y += elementObj.speed;
        wordEl.style.top = `${elementObj.y}px`;

        // Check if reached bottom
        if (elementObj.y > pbtm.clientHeight - 30) {
            removeElement(elementObj, false);
            loseLife();
        } else {
            requestAnimationFrame(fall);
        }

        updateParticles();
    };

    requestAnimationFrame(fall);
}

// Remove element from game
function removeElement(elementObj, hit) {
    const index = activeElements.indexOf(elementObj);
    if (index > -1) {
        activeElements.splice(index, 1);
    }

    if (hit) {
        elementObj.element.classList.add('hit');
        const rect = elementObj.element.getBoundingClientRect();
        const pbtmRect = document.querySelector("#pbtm").getBoundingClientRect();
        const x = rect.left - pbtmRect.left + rect.width / 2;
        const y = rect.top - pbtmRect.top + rect.height / 2;

        createParticles(x, y, elementObj.isWord ? '#ff0' : '#0ff');
        showCombo(x, y);

        setTimeout(() => {
            elementObj.element.remove();
        }, 500);
    } else {
        elementObj.element.remove();
    }
}

// Check input against falling elements
function checkInput(input) {
    if (gameOver) return false;

    // Find matching element (prioritize words, then lowest elements)
    let elementToRemove = null;
    let lowestY = -1;

    for (const element of activeElements) {
        if (element.value === input.toUpperCase()) {
            if (element.y > lowestY) {
                lowestY = element.y;
                elementToRemove = element;
            }
        }
    }

    if (elementToRemove) {
        increaseScore(elementToRemove.value);
        removeElement(elementToRemove, true);
        return true;
    }

    return false;
}

// Lose life
function loseLife() {
    lives--;
    updateLivesDisplay();

    // Visual feedback for losing life
    const pbtm = document.querySelector("#pbtm");
    const rect = pbtm.getBoundingClientRect();
    createParticles(rect.width / 2, rect.height / 2, '#f00');

    if (lives <= 0) {
        endGame();
    }
}

// End game
function endGame() {
    gameOver = true;
    clearInterval(spawnInterval);
    clearInterval(difficultyInterval);

    document.querySelector("#final-score").textContent = `SCORE: ${score}`;
    document.querySelector("#high-score").textContent = `HIGH SCORE: ${highScore}`;
    document.querySelector("#game-over").style.display = "flex";
}

// Timer
function runTimer() {
    let timerint = setInterval(() => {
        if (timer > 0 && !gameOver) {
            timer--;
            document.querySelector("#timervalue").textContent = timer;

            // Flash red when time is running low
            if (timer <= 10) {
                const timerBox = document.querySelector("#timervalue");
                timerBox.style.animation = 'none';
                setTimeout(() => {
                    timerBox.style.animation = 'pulse 0.5s infinite';
                    timerBox.style.color = '#ff5555';
                }, 10);
            }
        } else {
            clearInterval(timerint);
            if (!gameOver) endGame();
        }
    }, 1000);
}

// Increase difficulty over time
function increaseDifficulty() {
    if (difficultyInterval) clearInterval(difficultyInterval);

    difficultyInterval = setInterval(() => {
        if (!gameOver) {
            fallSpeed += 0.1;

            // Increase spawn rate up to a limit
            const currentInterval = parseInt(spawnInterval._idleTimeout);
            if (currentInterval > 500) {
                clearInterval(spawnInterval);
                spawnInterval = setInterval(() => {
                    if (!gameOver) {
                        if (Math.random() < 0.7) {
                            spawnLetter();
                        } else {
                            spawnWord();
                        }
                    }
                }, currentInterval - 100);
            }
        }
    }, 5000); // Increase difficulty every 5 seconds
}

// Event listeners
document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    // Handle backspace
    if (e.key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        return;
    }

    // Handle space or enter to submit
    if (e.key === " " || e.key === "Enter") {
        if (currentInput.length > 0) {
            checkInput(currentInput);
            currentInput = "";
        }
        return;
    }

    // Only allow letters
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        currentInput += e.key;

        // Check for matches with active elements
        for (const element of activeElements) {
            if (element.value.startsWith(currentInput.toUpperCase())) {
                // Highlight matching letters
                const matched = currentInput.length;
                const unmatched = element.value.length - matched;

                if (element.isWord) {
                    element.element.innerHTML =
                        `<span style="color:#0f0">${element.value.substring(0, matched)}</span>` +
                        `${element.value.substring(matched)}`;
                }

                // Auto-submit if full match
                if (currentInput.toUpperCase() === element.value) {
                    checkInput(currentInput);
                    currentInput = "";
                }
                break;
            }
        }
    }
});

// Mobile input handling
document.getElementById('submit-word').addEventListener('click', () => {
    const input = document.getElementById('input-field').value;
    if (input && !gameOver) {
        checkInput(input);
        document.getElementById('input-field').value = '';
    }
});

document.getElementById('input-field').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const input = document.getElementById('input-field').value;
        if (input && !gameOver) {
            checkInput(input);
            document.getElementById('input-field').value = '';
        }
    }
});

// Restart game
document.getElementById('restart-btn').addEventListener('click', startGame);

// Initialize game
initGame();