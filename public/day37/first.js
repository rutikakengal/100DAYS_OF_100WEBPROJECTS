alert("Please share and support my work!!!")
alert("If you like my project , then make sure to hit on the like button and also feel free to comment about it!!!")
let boxes= document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new");
let msgContainer=document.querySelector(".msg-container");
let msg= document.querySelector("#msg");

let turnO = true
let count = 0; //To Track Draw
const winPatterns= [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],

];

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
  };

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (turnO) {
        //playerO
        box.innerText = "O";
        turnO = false;
      } else {
        //playerX
        box.innerText = "X";
        turnO = true;
      }
      box.disabled = true;
      count++;
  
      let isWinner = checkWinner();
  
      if (count === 9 && !isWinner) {
        gameDraw();
      }
    });
  });


const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
  };

const disableBoxes = () => {
    for (let box of boxes) {
      box.disabled = true;
    }
  };



const enableBoxes = () => {
    for (let box of boxes) {
      box.disabled = false;
      box.innerText = "";
    }
  };

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
  };

 const checkWinner= ()=>{
    for ( let pattern of winPatterns){
        console.log(boxes[pattern[0]].innerText
            ,boxes[pattern[1]].innerText
            ,boxes[pattern[2]].innerText);

            let pos1val = boxes[pattern[0]].innerText

            let pos2val = boxes[pattern[1]].innerText
            let pos3val = boxes[pattern[2]].innerText

            if(pos1val != "" && pos2val != "" && pos3val !="" ){
                if(pos1val===pos2val && pos2val===pos3val){
                    console.log("WINNER",pos1val);
                    showWinner(pos1val);
                }
            }

    }
 } ;


 newGameBtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);

