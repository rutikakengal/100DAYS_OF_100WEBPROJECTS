
const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll(".choice");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const winnerEl = document.getElementById("winner");
const playerChoiceEl = document.getElementById("player-choice");
const computerChoiceEl = document.getElementById("computer-choice");

let playerScore = 0;
let computerScore = 0;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const playerChoice = button.dataset.choice;
    const computerChoice = getComputerChoice();
    const winner = getWinner(playerChoice, computerChoice);
    updateUI(playerChoice, computerChoice, winner);
  });
});

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getWinner(player, computer) {
  if (player === computer) return "draw";
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    playerScore++;
    return "player";
  } else {
    computerScore++;
    return "computer";
  }
}

function updateUI(player, computer, winner) {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  playerChoiceEl.textContent = `You: ${capitalize(player)}`;
  computerChoiceEl.textContent = `CPU: ${capitalize(computer)}`;

  if (winner === "draw") {
    winnerEl.textContent = "It's a draw!";
  } else if (winner === "player") {
    winnerEl.textContent = "You win! 🎉";
  } else {
    winnerEl.textContent = "Computer wins! 🤖";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

