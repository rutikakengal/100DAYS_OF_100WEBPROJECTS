const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing tests are fun and improve your keyboard skills.",
  "Practice makes perfect when it comes to typing speed.",
  "JavaScript powers interactive websites.",
  "Coding is a superpower you can learn."
];

let currentQuote = "";
let timer = 0;
let interval = null;
let isTyping = false;

const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");

const finishBtn = document.getElementById("finish");
const restartButton = document.getElementById("restart");

const resultBox = document.getElementById("resultBox");
const finalTime = document.getElementById("finalTime");
const finalWPM = document.getElementById("finalWPM");
const finalAccuracy = document.getElementById("finalAccuracy");

// Load new quote
function loadNewQuote() {
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.textContent = currentQuote;
  quoteInput.value = "";
  resetStats();
}

// Start timer
function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerElement.textContent = timer;
    updateStats();
  }, 1000);
}

// Stop timer
function stopTimer() {
  clearInterval(interval);
}

// Calculate stats
function updateStats(showFinal = false) {
  const typedText = quoteInput.value;
  const typedWords = typedText.trim().split(" ").filter(word => word !== "").length;
  const correctChars = getCorrectCharacterCount(typedText);
  const accuracy = Math.round((correctChars / currentQuote.length) * 100);

  const wpm = Math.round((typedWords / timer) * 60) || 0;

  wpmElement.textContent = wpm;
  accuracyElement.textContent = `${accuracy}%`;

  if (showFinal) {
    finalTime.textContent = timer;
    finalWPM.textContent = wpm;
    finalAccuracy.textContent = `${accuracy}%`;
    resultBox.style.display = "block";
  }

  if (typedText === currentQuote && !showFinal) {
    stopTimer();
    quoteInput.disabled = true;
  }
}

// Count correct characters
function getCorrectCharacterCount(typed) {
  let count = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentQuote[i]) count++;
  }
  return count;
}

// Reset all stats
function resetStats() {
  timer = 0;
  timerElement.textContent = 0;
  wpmElement.textContent = 0;
  accuracyElement.textContent = "100%";
  quoteInput.disabled = false;
  isTyping = false;
  stopTimer();
  resultBox.style.display = "none";
}

// Event: Start typing
quoteInput.addEventListener("input", () => {
  if (!isTyping) {
    isTyping = true;
    startTimer();
  }
  updateStats();
});

// Event: Finish test
finishBtn.addEventListener("click", () => {
  stopTimer();
  quoteInput.disabled = true;
  updateStats(true); // Show final result
});

// Event: Restart test
restartButton.addEventListener("click", () => {
  loadNewQuote();
});

// Load first quote on page load
window.addEventListener("load", () => {
  loadNewQuote();
});



