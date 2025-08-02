  const words = ["javascript", "hangman", "coding", "programming", "developer"];
  let selectedWord = "";
  let attemptsLeft = 6;
  let guessedLetters = [];
  let correctLetters = [];

  const wordDisplay = document.getElementById("wordDisplay");
  const wrongLetters = document.getElementById("wrongLetters");
  const attempts = document.getElementById("attemptsLeft");
  const letterInput = document.getElementById("letterInput");
  const guessBtn = document.getElementById("guessBtn");
  const restartBtn = document.getElementById("restartBtn");
  const message = document.getElementById("message");

  function startGame() {
      selectedWord = words[Math.floor(Math.random() * words.length)];
      attemptsLeft = 6;
      guessedLetters = [];
      correctLetters = [];
      updateDisplay();
      message.textContent = "";
      restartBtn.style.display = "none";
  }

  function updateDisplay() {
      wordDisplay.textContent = selectedWord.split("").map(letter => (correctLetters.includes(letter) ? letter : "_")).join(" ");
      wrongLetters.textContent = `Wrong Letters: ${guessedLetters.filter(letter => !correctLetters.includes(letter)).join(", ")}`;
      attempts.textContent = attemptsLeft;
  }

  function handleGuess() {
      const letter = letterInput.value.toLowerCase();
      letterInput.value = "";

      if (guessedLetters.includes(letter) || letter === "") {
          return;
      }

      guessedLetters.push(letter);

      if (selectedWord.includes(letter)) {
          correctLetters.push(letter);
      } else {
          attemptsLeft--;
      }

      if (attemptsLeft === 0) {
          message.textContent = `Game Over! The word was "${selectedWord}".`;
          restartBtn.style.display = "block";
      } else if (correctLetters.length === new Set(selectedWord).size) {
          message.textContent = "Congratulations! You've guessed the word!";
          restartBtn.style.display = "block";
      }

      updateDisplay();
  }

  guessBtn.addEventListener("click", handleGuess);
  restartBtn.addEventListener("click", startGame);

  // Start the game on page load
  startGame();
  