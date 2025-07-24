const paragraphText = [
  "Typing is an important skill that helps improve productivity.",
  "Practice daily to become a faster and more accurate typist.",
  "The quick brown fox jumps over the lazy dog every morning.",
  "Consistent practice is the key to mastering typing speed.",
  "Improve your typing with focus, dedication, and effort.",
  "Keyboard accuracy increases with mindful repetition.",
  "Correct posture and finger placement boost efficiency.",
  "Challenge yourself with harder paragraphs each day."
];

const paragraph = document.getElementById("paragraph");
const inputArea = document.getElementById("inputArea");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");

let timer;
let timeLeft = 60;
let totalTyped = 0;
let correctChars = 0;
let fullText = '';
let currentIndex = 0;

startBtn.addEventListener("click", startTest);

function startTest() {
  clearInterval(timer);
  inputArea.disabled = false;
  inputArea.value = '';
  timeLeft = 60;
  correctChars = 0;
  totalTyped = 0;
  currentIndex = 0;
  wpmEl.innerText = '0';
  accuracyEl.innerText = '100';
  timeEl.innerText = timeLeft;
  paragraph.innerHTML = '';
  fullText = '';

  appendMoreText();

  inputArea.focus();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      inputArea.disabled = true;
      calculateResults();
    }
  }, 1000);
}

function appendMoreText() {
  const nextLine = paragraphText[Math.floor(Math.random() * paragraphText.length)];
  nextLine.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    paragraph.appendChild(span);
    fullText += char;
  });
}

inputArea.addEventListener("keydown", (e) => {
  if (timeLeft <= 0) return;

  const spans = paragraph.querySelectorAll('span');

  if (e.key === "Backspace") {
    if (currentIndex > 0) {
      currentIndex--;
      spans[currentIndex].classList.remove('correct', 'incorrect');
    }
    return;
  }

  const key = e.key;

  if (key.length !== 1) return; // ignore special keys

  const currentChar = fullText[currentIndex];

  totalTyped++;

  if (key === currentChar) {
    spans[currentIndex].classList.add('correct');
    spans[currentIndex].classList.remove('incorrect');
    correctChars++;
  } else {
    spans[currentIndex].classList.add('incorrect');
    spans[currentIndex].classList.remove('correct');
  }

  currentIndex++;

  // Add more text if close to the end
  if (fullText.length - currentIndex < 20) {
    appendMoreText();
  }
});

function calculateResults() {
  const words = inputArea.value.trim().split(/\s+/).length;
  const accuracy = Math.round((correctChars / totalTyped) * 100) || 0;

  wpmEl.innerText = Math.round(words);
  accuracyEl.innerText = accuracy;
}
