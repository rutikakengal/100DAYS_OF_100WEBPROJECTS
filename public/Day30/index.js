let gameSeq =[];
let userSeq=[];
 
let btns= ["yellow","red","purple","green"];

let started = false;
let level = 0;

 const sounds = {
      green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
      red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
      yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
      purple: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
      wrong: new Audio("https://s3.amazonaws.com/adam-recvlohe-sounds/error.wav")
    };


     function playSound(name) {
      sounds[name].play();
    }


let h2 = document.querySelector("h2");

document.addEventListener("keypress",function(){
       if (started==false){
        console.log("game is started");
        started = true;
       }

       levelUp();
});

function gameFlash(btn){

    btn.classList.add("flash");
    setTimeout(function() {
    btn.classList.remove("flash");
    },200);
}


function userFlash(btn){

    btn.classList.add("userFlash");
    setTimeout(function() {
    btn.classList.remove("userFlash");
    },200);
}


function levelUp(){
    userSeq=[];
    level++;
    h2.innerText=`level ${level}`;
    let randIdx= Math.floor(Math.random() *3);
    let randColor= btns[randIdx];
    let randBtn=document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    console.log(gameSeq);
    
    gameFlash(randBtn);
    setTimeout(() => {
        playSound(randColor);
      }, 500);

}

function checkAns(idx){

    if (userSeq[idx]=== gameSeq[idx]){
     if(userSeq.length==gameSeq.length){
          setTimeout(levelUp,1000);
    }
    }else{
    playSound("wrong");
    h2.innerHTML=`Game over! Your score was  <b> ${level}</b></br> Press any key to start`;
    document.querySelector("body").style.backgroundColor="red";
    setTimeout(function(){
    document.querySelector("body").style.backgroundColor="rgb(46, 44, 44)";

    },150);
    reset();
        
    }
}

function btnPress(){
    console.log(this);
    let btn =this;
    userFlash(btn);
    
    userColor= btn.getAttribute("id");
    userSeq.push(userColor);    
    checkAns(userSeq.length-1);
     playSound(userColor);

}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
  btn.addEventListener("click",btnPress);
}

function reset(){
    started=false;
    gameSeq=[];
    user=[];
    level=0;
}