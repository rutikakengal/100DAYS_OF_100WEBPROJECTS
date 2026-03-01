const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width=400;
canvas.height=600;

let score=0;

const player = {
  x:canvas.width/2-40,
  y:canvas.height-40,
  width:80,
  height:20,
  speed:10
};

const fruit = {
  x:Math.random()*(canvas.width-30),
  y:0,
  radius:15,
  speed:4
};

document.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft"&&player.x>0){
    player.x -= player.speed;
  }else if(e.key==="ArrowRight"&&player.x+player.width<canvas.width){
    player.x+=player.speed;
  }
});

function drawPlayer(){
  ctx.fillStyle="#5f2907ff";
  ctx.fillRect(player.x,player.y,player.width,player.height);
}

function drawFruit(){
  ctx.beginPath();
  ctx.arc(fruit.x,fruit.y,fruit.radius,0,Math.PI*2);
  ctx.fillStyle="#eb0707ff"
  ctx.fill();
  ctx.closePath();
}


function checkCollision(){
  if(
    fruit.y+fruit.radius>=player.y && fruit.x>=player.x && fruit.x<=player.x+player.width
    
  ){
    score++;
    document.getElementById("scoreDisplay").innerText="Score:"+score;
    resetFruit();
  } else if(fruit.y > canvas.height){
    document.getElementById("gameOverMsg").innerText="Game Over!";
    score=0;
    document.getElementById("scoreDisplay").innerText="Score:"+score;
    resetFruit();
  }
}

function resetFruit(){
  fruit.x = Math.random()*(canvas.width-30);
  fruit.y=0;
}

function updateGame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawPlayer();
  drawFruit();
  fruit.y += fruit.speed;
  checkCollision();
  requestAnimationFrame(updateGame);
}

updateGame();