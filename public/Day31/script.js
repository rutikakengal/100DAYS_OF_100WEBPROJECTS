let currentQuote = "";
let timer = 0;
let maxTime = 60;
let interval = null;
let isTyping = false;

const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const progressBar = document.getElementById("progressBar");

const finishBtn = document.getElementById("finish");
const restartButton = document.getElementById("restart");
const timeMode = document.getElementById("timeMode");
const leaderboardList = document.getElementById("leaderboardList");

// 🔹 Load new paragraph dynamically (API → fallback JSON)
async function loadNewQuote() {
  try {
    // API for long paragraphs
    const res = await fetch("https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text");
    if (!res.ok) throw new Error("API failed");
    const data = await res.text();
    currentQuote = data;
  } catch (error) {
    console.warn("⚠️ API failed, using local fallback JSON.");
    const res = await fetch("paragraphs.json"); // local file
    const data = await res.json();
    currentQuote = data.paragraphs[Math.floor(Math.random() * data.paragraphs.length)];
  }

  quoteDisplay.textContent = currentQuote;
  quoteInput.value = "";
  quoteDisplay.scrollTop = 0; // reset scroll to top
}

// 🔹 Highlight errors and auto-scroll
function highlightErrors() {
  const typedText = quoteInput.value;
  const typedChars = typedText.split("");
  const quoteChars = currentQuote.split("");

  let formatted = "";
  let isComplete = true;

  for (let i = 0; i < quoteChars.length; i++) {
    if (typedChars[i] == null) {
      formatted += `<span>${quoteChars[i]}</span>`;
      isComplete = false;
    } else if (typedChars[i] === quoteChars[i]) {
      formatted += `<span style="color:green;">${quoteChars[i]}</span>`;
    } else {
      formatted += `<span style="color:red;">${quoteChars[i]}</span>`;
      isComplete = false;
    }
  }

  quoteDisplay.innerHTML = formatted;

  // 🔹 Auto-scroll as user types
  quoteDisplay.scrollTop = quoteDisplay.scrollHeight;

  // ✅ If user finishes this paragraph before timer ends → load next seamlessly
  if (isComplete && typedChars.length >= quoteChars.length && timer < maxTime) {
    loadNewQuote();
  }
}

// 🔹 Start timer (keeps running until time ends)
function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerElement.textContent = timer;
    updateStats();
    updateProgress();

    if (timer >= maxTime) {
      stopTimer();
      quoteInput.disabled = true;
      updateStats(true); // Final stats at the end
    }
  }, 1000);
}

// 🔹 Stop timer
function stopTimer() {
  clearInterval(interval);
}

// 🔹 Update progress bar
function updateProgress() {
  let percent = (timer / maxTime) * 100;
  progressBar.style.width = percent + "%";
}

// 🔹 Calculate stats
function updateStats(showFinal = false) {
  const typedText = quoteInput.value;
  const typedWords = typedText.trim().split(" ").filter(word => word !== "").length;
  const correctChars = getCorrectCharacterCount(typedText);
  const accuracy = Math.round((correctChars / currentQuote.length) * 100);

  const wpm = Math.round((typedWords / (timer / 60))) || 0;

  wpmElement.textContent = wpm;
  accuracyElement.textContent = `${accuracy}%`;

  if (showFinal) {
    saveScore(wpm, accuracy);
    renderLeaderboard();
  }
}

// 🔹 Count correct characters
function getCorrectCharacterCount(typed) {
  let count = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === currentQuote[i]) count++;
  }
  return count;
}

// 🔹 Reset all stats
function resetStats() {
  timer = 0;
  timerElement.textContent = 0;
  wpmElement.textContent = 0;
  accuracyElement.textContent = "100%";
  quoteInput.disabled = false;
  isTyping = false;
  stopTimer();
  progressBar.style.width = "0%";
}

// 🔹 Save score in localStorage
function saveScore(wpm, accuracy) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({ wpm, accuracy, date: new Date().toLocaleString() });
  localStorage.setItem("scores", JSON.stringify(scores));
}

// 🔹 Render leaderboard
function renderLeaderboard() {
  leaderboardList.innerHTML = "";
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.slice(-5).reverse().forEach(score => {
    const li = document.createElement("li");
    li.textContent = `${score.date} - WPM: ${score.wpm}, Accuracy: ${score.accuracy}%`;
    leaderboardList.appendChild(li);
  });
}

// 🔹 Event Listeners
quoteInput.addEventListener("input", () => {
  if (!isTyping) {
    isTyping = true;
    startTimer();
  }
  highlightErrors();
  updateStats();
});

finishBtn.addEventListener("click", () => {
  stopTimer();
  quoteInput.disabled = true;
  updateStats(true);
});

restartButton.addEventListener("click", () => {
  resetStats();
  loadNewQuote();
});

timeMode.addEventListener("change", (e) => {
  maxTime = parseInt(e.target.value);
  resetStats();
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 🔹 Load first paragraph on page load
window.addEventListener("load", () => {
  resetStats();
  loadNewQuote();
  renderLeaderboard();
});
