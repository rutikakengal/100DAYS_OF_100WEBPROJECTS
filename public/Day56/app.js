let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true;

const winPatters = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];
//reset the game
const resetGame = () => {
 turnO= true;
 enableBoxes();
 msgContainer.classList.add("hide");
};
// adding event listener to each box
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO === true) { //player1
            box.innerText = "O";
            turnO = false;
        } else {
            box.innerText = "X"; //player2
            turnO = true;
        }
        box.disabled = true; // disable the box after click

        checkWinner(); // check wining patterns
    });
});

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = ""; // clear the text in the box
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

// to display winner
const showWinner = (winner) => {
    msg.innerText = `Congratulations🏆, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

// to check if there is a winner
const checkWinner = () => {
    for (let pattern of winPatters) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {  // check all 3 are are filled
            if (pos1Val === pos2Val && pos2Val === pos3Val) {  // check if all 3 are equal
                showWinner(pos1Val); // show winner
            }
        }
    }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);