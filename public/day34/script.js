let gameStarted = false;

//board
let board;
let boardWidth = 1500;
let boardHeight = 720;
let context;

//bird
let birdVelocityX = 1;
let birdWidth = 75;
let birdHeight = 65;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 50;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -0.75; // pipes moving speed
let velocityY = 0; // bird jump
let gravity = 0.075;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // ⭐ High score

window.onload = function () {

    document.getElementById("startBtn").addEventListener("click", () => {
      document.getElementById("startMenu").style.display = "none";
      gameStarted = true;
      requestAnimationFrame(update); // Start game loop
    });
  
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load bird image
    birdImg = new Image();
    birdImg.src = "images/bird5.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //load pipe images
    topPipeImg = new Image();
    topPipeImg.src = 'images/top.jpeg';
    bottomPipeImg = new Image();
    bottomPipeImg.src = 'images/bottom.jpeg';

    //load background
    backgroundImg = new Image();
    backgroundImg.src = "images/background.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener('keydown', moveBird);
    document.addEventListener('touchstart', moveBird);
}

// background (if used)
let backgroundImg = new Image();
let backgroundX = 0;
let backgroundScrollSpeed = 1.5; // same as velocityX
backgroundImg.src = "images/background.png";

function update() {

    if (!gameStarted) return;
    
    requestAnimationFrame(update);
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);

    // bird physics
    velocityY += gravity;
    bird.x += birdVelocityX;
    if (bird.x > board.width / 2) {
        bird.x = board.width / 2;
    }
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // ⭐ Stylish score display box
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(15, 15, 240, 90); // x, y, width, height
    context.strokeStyle = "gold";
    context.lineWidth = 3;
    context.strokeRect(15, 15, 240, 90);

    // Text styling
    context.fillStyle = "white";
    context.font = "bold 24px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    context.fillText("⭐ Score: " + score, 25, 45);
    context.fillText("🏆 High Score: " + highScore, 25, 85);

    if (gameOver) {
        context.fillText("GAME OVER!", 45, 300);
    }
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 3;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(event) {
    if (event.code == "Space" || event.code == "ArrowUp" || event.type === "touchstart") {
        velocityY = -3;
    }

    // reset game on input if over
    if (gameOver) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // ⭐ Save high score
        }
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}