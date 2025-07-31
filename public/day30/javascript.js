let num = parseInt((Math.random()*10+1));
console.log(num);
const submit = document.querySelector('#submit');
const input = document.querySelector('#guess');
const msg = document.querySelector('.msg');
const prev = document.querySelector('.prev');
const rem = document.querySelector('.rem');
const res_box = document.querySelector('.res_box');

let playGame = true;
let rem_val=3;
let guess;
let p;

if (playGame){
    submit.addEventListener('click', function(e){
        e.preventDefault();
        guess = parseInt(input.value);
        input.value='';
        if(validateGuess(guess)){
            prev.innerHTML +=`${guess}  `;
            if(guess === num){
                msg.innerHTML = "Congratulations! Your answer is correct :)";
                rem.innerHTML = --rem_val;
                endGame();
            }
            else{
                msg.innerHTML = "Wrong Answer! Better Luck Next Time :("
                rem.innerHTML = --rem_val;
            }
        }
    })
};
function validateGuess(val){
    if(val<1 || isNaN(val) || val>10){
        msg.innerHTML = "Invalid value!";
        endGame();
    }
    else if(rem_val==1 && guess!=num){
        msg.innerHTML = `Game Over! Answer was ${num}!`;
        prev.innerHTML +=`${guess}  `;
        rem.innerHTML = --rem_val;
        endGame();
    }
    else
        return true;
};
function endGame(){
    input.value = '';
    input.setAttribute('disabled', '');
    p = document.createElement('button');
    p.innerHTML = `<h2 id="new_game">Start New Game</h2>`;
    res_box.appendChild(p);
    playGame = false;
    p.addEventListener('click', newGame);
};

function newGame() {
    num = parseInt((Math.random()*10+1));
    console.log(num);
    rem_val=3;
    rem.innerHTML = rem_val;
    prev.innerHTML = '';
    msg.innerHTML = '';
    input.removeAttribute('disabled');
    res_box.removeChild(p);
    playGame = true;
}


