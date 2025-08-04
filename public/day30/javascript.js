let secretNumber = Math.floor(Math.random() * 100) + 1;
let score = 10;
let guesses = [];

function checkGuess() {
  const guess = Number(document.getElementById("guessInput").value);
  const message = document.getElementById("message");
  const scoreDisplay = document.getElementById("score");
  const lastGuess = document.getElementById("lastGuess");
  const guessHistory = document.getElementById("guessHistory");

  if (!guess || guess < 1 || guess > 100) {
    message.textContent = "Please enter a number between 1 and 100!";
    lastGuess.textContent = "";
    return;
  }

  guesses.push(guess);
  lastGuess.textContent = `You guessed: ${guess}`;
  guessHistory.textContent = `Previous guesses: ${guesses.join(", ")}`;

  if (guess === secretNumber) {
    message.textContent = "🎉 Correct! You guessed the number!";
    document.body.style.background =
      "linear-gradient(to right, #00b09b, #96c93d)";
  } else {
    score--;
    if (score === 0) {
      message.textContent = `💀 Game Over! The number was ${secretNumber}`;
      document.getElementById("guessInput").disabled = true;
    } else {
      message.textContent =
        guess > secretNumber ? "📉 Too high!" : "📈 Too low!";
    }
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

function restartGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  score = 10;
  guesses = [];
  document.getElementById("message").textContent = "";
  document.getElementById("score").textContent = "Score: 10";
  document.getElementById("lastGuess").textContent = "";
  document.getElementById("guessHistory").textContent = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").disabled = false;
  document.body.style.background =
    "linear-gradient(to right, #667eea, #764ba2)";
}
