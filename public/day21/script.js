window.onload = () => {
  let boardHeight = 500;
  let boardWidth = 400;
  let context;
  let platforms=[];
  let time=0;
  let timer;
  const current_score=document.getElementById("currentscore");
  const high_score=document.getElementById("highscore");
  const jumpSound = new Audio('./assets/doodlejumpsound.mp3');
  const gameoversound= new Audio("./assets/negative_beeps-6008.mp3")
  const currentHigh = JSON.parse(localStorage.getItem("highscore")) || 0;

  let doodlerHeight = 40;
  let doodlerWidth = 40;
  let doodlerx = boardWidth / 2 - doodlerWidth / 2; //+x means rightwards
  let doodlery = boardHeight / 2 - doodlerHeight / 2; //+y means downwards

  let velocityx = 100;
  let velocityy = 0;
  let jumpPower=-15;
  let gravity = 0.4;
  let isJumping = false;
  let gameIsOver=false;

  let doodlerrightimg = new Image();
  let doodlerleftimg = new Image();

  high_score.innerHTML=`${currentHigh}`;

  //creating doodler sprite
  let doodler = {
    img: null,
    x: doodlerx,
    y: doodlery,
    width: doodlerWidth,
    height: doodlerHeight,
  };

  //audio effects 

  function playJumpSound() {
    jumpSound.currentTime = 0; // rewind to start if playing
    jumpSound.play();
  }

  function playgameoversound(){
    gameoversound.currentTime=0;
    gameoversound.play();
  }
  // Load images
  doodlerrightimg.src = "./assets/doodler-right.png";
  doodlerleftimg.src = "./assets/doodler-left.png";
  doodler.img = doodlerrightimg;

  //create canvas context
  const board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //reset game
  document.addEventListener("keydown", (e)=>{
  if (e.code === "Space" && gameIsOver) {
    location.reload();
  }}) 
  
  //function to control doodler movements based on key pressed
  const movedoodler=(e)=>{

    if (e.code === "ArrowLeft") {
         if (!isJumping) {
          velocityy = jumpPower; // jump upward
          isJumping = true;
        }
      doodler.x -= velocityx;
      doodler.img = doodlerleftimg;
    } else if (e.code === "ArrowRight") {
         if (!isJumping) {
          velocityy = jumpPower; // jump upward
          isJumping = true;
        }
      doodler.x += velocityx;
      doodler.img = doodlerrightimg;
    } else if (e.code === "ArrowUp") {
      if (!isJumping) {
        isJumping = true;
        velocityy = jumpPower;
      }
    }
    if (doodler.x < 0) doodler.x = 0;
    if (doodler.x + doodler.width > boardWidth) doodler.x = boardWidth - doodler.width;

  }

  //function to adjust highscore after each game ends and display 
  //game over message
  const gameOver=()=>{
    let para=document.querySelector('.gameover');
    para.innerHTML+="GAME OVER <br> Press <b>SPACE</b> to restart";
    para.style.fontSize = "30px";
    para.style.fontWeight = "bold";
    para.style.textAlign = "center";
    
    if (time > currentHigh) {
      localStorage.setItem("highscore", JSON.stringify(time));
    }
    clearInterval(timer);
    time=0;
    playgameoversound();
    gameIsOver=true;
  }

  document.addEventListener("keydown", movedoodler);

  doodlerrightimg.onload = () => {
    update();
    timer=setInterval(()=>{time++},100);

  createplatforms();
  };

  //function to constantly update sprite state
  function update() {
    
    
    if (doodler.y > boardHeight) {
    gameOver(); // Falling off bottom
    return;
   }
   
    current_score.innerHTML=`${time}`;
    context.clearRect(0, 0, boardWidth, boardHeight);

    // Gravity
    if (doodler.y <= boardHeight / 2 && velocityy < 0) {
      // Move platforms down instead of moving doodler up

      for (let i in platforms){
        if (platforms[i].y+6-velocityy>boardHeight) platforms.splice(i,1);
        else platforms[i].y-=velocityy;
      }
      while (platforms.length<15){
        let x = Math.random() * (boardWidth - 50);
        let y = Math.random() * -boardHeight; // randomly placed above the screen
        platforms.push({ x, y, width: 50, height: 6 });
      }
    } else {
      doodler.y += velocityy;
    }
    velocityy += gravity;

    checkPlatformCollision();

    drawPlatforms();

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    
    requestAnimationFrame(update);
  }

function createplatforms() {

  let totalHeight = 1500; // simulate a taller space above canvas (3x screen height)

  for (let i = 0; i < 15; i++) { // number of initial platforms
    let x = Math.random() * (boardWidth - 50);
    let y = boardHeight - (i * (totalHeight / 15)); // spread platforms vertically upward
    platforms.push({ x, y, width: 50, height: 6 });
  }
}

function checkPlatformCollision() {
  for (let p of platforms) {
    const doodlerBottom = doodler.y + doodler.height;
    const prevBottom = doodler.y + doodler.height - velocityy; // previous frame bottom
    const platformTop = p.y;
    const platformBottom = p.y + p.height;
    const doodlerRight = doodler.x + doodler.width;
    const doodlerLeft = doodler.x;
    const platformRight = p.x + p.width;
    const platformLeft = p.x;

    const isFalling = velocityy > 0;

    const verticalTouching = prevBottom <= platformTop && doodlerBottom >= platformTop;
    const horizontalOverlap = doodlerRight > platformLeft && doodlerLeft < platformRight;

    if (isFalling && verticalTouching && horizontalOverlap) {
      doodler.y = platformTop - doodler.height; // snap to platform
      velocityy = jumpPower;
      isJumping = false;
      playJumpSound();
      break;
    }
  }
}



function drawPlatforms(){
  context.fillStyle="green";
  for(let elem of platforms){
    context.fillRect(elem.x,elem.y,elem.width,elem.height);
  }
}

};