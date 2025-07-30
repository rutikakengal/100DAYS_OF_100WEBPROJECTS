const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");
const modeLabel = document.getElementById("mode");

let isFocus = true;
let interval = null;
let remainingSeconds = 0;

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  modeLabel.textContent = isFocus ? "Focus" : "Break";
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      isFocus = !isFocus;
      remainingSeconds = (isFocus ? parseInt(focusInput.value) : parseInt(breakInput.value)) * 60;
      updateDisplay();
      startTimer(); // auto-start next session
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isFocus = true;
  remainingSeconds = parseInt(focusInput.value) * 60;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
focusInput.addEventListener("change", resetTimer);
breakInput.addEventListener("change", resetTimer);

resetTimer(); // Set initial state
