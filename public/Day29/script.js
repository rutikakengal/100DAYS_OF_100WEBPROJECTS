let score = 0;
let gameInterval;
let timerInterval;
let timeLeft = 45; 
const dollsContainer = document.getElementById('dolls');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const endGameScreen = document.getElementById('endGame');
const finalScoreDisplay = document.getElementById('finalScore');

function startGame() {
    score = 0;
    timeLeft = 45; 
    scoreDisplay.textContent = 'Score: ' + score;
    timerDisplay.textContent = 'Time: ' + timeLeft;
    dollsContainer.innerHTML = '';
    endGameScreen.classList.add('hidden'); 
    startButton.disabled = true; // Disable start button

    gameInterval = setInterval(createDoll, 500);
    timerInterval = setInterval(updateTimer, 1000);
}

function createDoll() {
    const doll = document.createElement('div');
    doll.classList.add('doll');
    doll.style.left = Math.random() * (dollsContainer.clientWidth - 50) + 'px';
    doll.style.top = '-100px'; 

   const dolls = [
        'https://png.pngtree.com/png-vector/20240101/ourmid/pngtree-beautiful-doll-golden-hair-image-png-image_11399067.png', 
        'https://png.pngtree.com/png-vector/20240224/ourmid/pngtree-a-beautiful-doll-with-cute-face-png-image_11870958.png',
        'https://png.pngtree.com/png-clipart/20230508/original/pngtree-doll-beautiful-doll-png-image_9147584.png',
        'https://png.pngtree.com/png-vector/20230902/ourmid/pngtree-the-cute-doll-png-image_9842435.png'
    ];
    doll.style.backgroundImage = `url(${dolls[Math.floor(Math.random() * dolls.length)]})`;

    dollsContainer.appendChild(doll);

    const fallDuration = Math.random() * 2000 + 2000; 
    doll.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${dollsContainer.clientHeight}px)`}], {
        duration: fallDuration,
        fill: 'forwards'
    });

    doll.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        createBloodEffect(doll);
        doll.remove(); 
    });

    setTimeout(() => {
        if (doll.parentNode) {
            doll.remove();
        }
    }, fallDuration);
}

function createBloodEffect(doll) {
    const blood = document.createElement('div');
    blood.classList.add('splatter');
    blood.style.left = doll.style.left;
    blood.style.top = doll.style.top;
    dollsContainer.appendChild(blood);

    setTimeout(() => {
        blood.remove(); 
    }, 500);
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = 'Time: ' + timeLeft;

    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        endGameScreen.classList.remove('hidden'); 
        finalScoreDisplay.textContent = score; 
        startButton.disabled = false; 
    }
}

function restartGame() {
    startGame();
}

startButton.addEventListener('click', startGame);