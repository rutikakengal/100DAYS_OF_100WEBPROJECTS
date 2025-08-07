const choices = ["rock", "paper", "scissors"];
let gameMode = null;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Choice = null;
let player2Choice = null;
let waitingForPlayer2 = false;

const modeSelectionScreen = document.getElementById("mode-selection");
const gameScreen = document.getElementById("game-screen");
const modeButtons = document.querySelectorAll(".mode-btn");
const backBtn = document.getElementById("back-btn");
const choiceButtons = document.querySelectorAll(".choice");
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");
const player1LabelEl = document.getElementById("player1-label");
const player2LabelEl = document.getElementById("player2-label");
const winnerEl = document.getElementById("winner");
const player1ChoiceEl = document.getElementById("player1-choice");
const player2ChoiceEl = document.getElementById("player2-choice");
const turnIndicator = document.getElementById("turn-indicator");
const currentPlayerEl = document.getElementById("current-player");
const continueSection = document.getElementById("continue-section");
const continueBtn = document.getElementById("continue-btn");

modeButtons.forEach(button => {
  button.addEventListener("click", () => {
    gameMode = button.dataset.mode;
    startGame();
  });
});

backBtn.addEventListener("click", () => {
  goBackToModeSelection();
});

choiceButtons.forEach(button => {
  button.addEventListener("click", () => {
    const choice = button.dataset.choice;
    handlePlayerChoice(choice);
  });
});

continueBtn.addEventListener("click", () => {
  if (player1Score >= 10 || player2Score >= 10) {
    goBackToModeSelection();
    continueBtn.textContent = "Continue to Next Round";
    continueBtn.onclick = () => resetForNextRound();
  } else {
    resetForNextRound();
  }
})
function startGame() {
  modeSelectionScreen.classList.remove("active");
  gameScreen.classList.add("active");

  player1Score = 0;
  player2Score = 0;
  currentPlayer = 1;
  player1Choice = null;
  player2Choice = null;
  waitingForPlayer2 = false;

  if (gameMode === "vs-computer") {
    player1LabelEl.textContent = "Player";
    player2LabelEl.textContent = "Computer";
    turnIndicator.classList.add("hidden");
    continueSection.classList.add("hidden");
    document.getElementById("win-note").classList.add("hidden"); // hide note
  } else {
    player1LabelEl.textContent = "Player 1";
    player2LabelEl.textContent = "Player 2";
    turnIndicator.classList.remove("hidden");
    currentPlayerEl.textContent = "Player 1's Turn";
    document.getElementById("win-note").classList.remove("hidden"); // show note
  }

  updateScoreboard();
  resetChoiceDisplay();
  winnerEl.textContent = "Make your move!";
  enableChoiceButtons();
}

function goBackToModeSelection() {
  gameScreen.classList.remove("active");
  modeSelectionScreen.classList.add("active");
  gameMode = null;
}

function handlePlayerChoice(choice) {
  if (gameMode === "vs-computer") {
    handleVsComputerChoice(choice);
  } else {
    handleTwoPlayerChoice(choice);
  }
}

function handleVsComputerChoice(playerChoice) {
  const computerChoice = getComputerChoice();
  const winner = getWinner(playerChoice, computerChoice);
  
  updateScores(winner);
  updateChoiceDisplay(playerChoice, computerChoice);
  updateWinnerDisplay(winner);
  updateScoreboard();
}

function handleTwoPlayerChoice(choice) {
  if (currentPlayer === 1) {
    player1Choice = choice;
    currentPlayer = 2;
    currentPlayerEl.textContent = "Player 2's Turn";
    player1ChoiceEl.textContent = "Player 1: ✓ Choice Made";
    winnerEl.textContent = "Player 2, make your move!";
  } else {
    player2Choice = choice;
    const winner = getWinner(player1Choice, player2Choice);

    updateScores(winner);
    updateChoiceDisplay(player1Choice, player2Choice);
    updateWinnerDisplay(winner);
    updateScoreboard();

    turnIndicator.classList.add("hidden");
    disableChoiceButtons();

    if (player1Score >= 10 || player2Score >= 10) {
      endGame();
    } else {
      continueSection.classList.remove("hidden");
    }
  }
}

function endGame() {
  disableChoiceButtons();
  turnIndicator.classList.add("hidden");

  let message;
  if (player1Score >= 10) {
    message = "🎉 Player 1 wins the game! 🏆";
  } else {
    message = "🎉 Player 2 wins the game! 🏆";
  }

  winnerEl.textContent = message;

  continueSection.classList.remove("hidden");
  continueBtn.textContent = "🔁 Play Again";

  continueBtn.onclick = () => {
    goBackToModeSelection();
    resetGameState();
    continueBtn.textContent = "Continue to Next Round";
    continueBtn.onclick = () => resetForNextRound();
  };
}

function resetGameState() {
  player1Score = 0;
  player2Score = 0;
  currentPlayer = 1;
  player1Choice = null;
  player2Choice = null;

  updateScoreboard();
  resetChoiceDisplay();
  winnerEl.textContent = "Make your move!";
  enableChoiceButtons();
  continueSection.classList.add("hidden");
  turnIndicator.classList.add("hidden");
}

function resetForNextRound() {
  currentPlayer = 1;
  player1Choice = null;
  player2Choice = null;
  
  currentPlayerEl.textContent = "Player 1's Turn";
  turnIndicator.classList.remove("hidden");
  continueSection.classList.add("hidden");
  
  resetChoiceDisplay();
  winnerEl.textContent = "Make your move!";
  enableChoiceButtons();
}

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function getWinner(choice1, choice2) {
  if (choice1 === choice2) return "draw";
  
  if (
    (choice1 === "rock" && choice2 === "scissors") ||
    (choice1 === "paper" && choice2 === "rock") ||
    (choice1 === "scissors" && choice2 === "paper")
  ) {
    return "player1";
  } else {
    return "player2";
  }
}

function updateScores(winner) {
  if (winner === "player1") {
    player1Score++;
  } else if (winner === "player2") {
    player2Score++;
  }
}

function updateScoreboard() {
  player1ScoreEl.textContent = player1Score;
  player2ScoreEl.textContent = player2Score;
}

function updateChoiceDisplay(choice1, choice2) {
  const player1Label = gameMode === "vs-computer" ? "You" : "Player 1";
  const player2Label = gameMode === "vs-computer" ? "CPU" : "Player 2";
  
  player1ChoiceEl.textContent = `${player1Label}: ${capitalize(choice1)}`;
  player2ChoiceEl.textContent = `${player2Label}: ${capitalize(choice2)}`;
}

function resetChoiceDisplay() {
  const player1Label = gameMode === "vs-computer" ? "You" : "Player 1";
  const player2Label = gameMode === "vs-computer" ? "CPU" : "Player 2";
  
  player1ChoiceEl.textContent = `${player1Label}: -`;
  player2ChoiceEl.textContent = `${player2Label}: -`;
}

function updateWinnerDisplay(winner) {
  if (winner === "draw") {
    winnerEl.textContent = "It's a draw!";
  } else if (winner === "player1") {
    const winnerText = gameMode === "vs-computer" ? "You win! 🎉" : "Player 1 wins! 🎉";
    winnerEl.textContent = winnerText;
  } else {
    const winnerText = gameMode === "vs-computer" ? "Computer wins! 🤖" : "Player 2 wins! 🎉";
    winnerEl.textContent = winnerText;
  }
}

function enableChoiceButtons() {
  choiceButtons.forEach(button => {
    button.disabled = false;
  });
}

function disableChoiceButtons() {
  choiceButtons.forEach(button => {
    button.disabled = true;
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}