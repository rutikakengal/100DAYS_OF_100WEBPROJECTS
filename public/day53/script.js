const text = document.getElementById('text');
const circle = document.getElementById('circle');
const counterDisplay = document.getElementById('counter');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const muteBtn = document.getElementById('muteBtn');
const calmAudio = document.getElementById('calmAudio');

let isInhale = true;
let interval;
let cycleCount = 0;
let isMuted = false;

function updateBreathingText() {
  if (isInhale) {
    text.textContent = 'Inhale';
  } else {
    text.textContent = 'Exhale';
    cycleCount++;
    counterDisplay.textContent = `Cycles: ${cycleCount}`;
  }
  isInhale = !isInhale;
}

function startBreathing() {
  text.textContent = 'Inhale';
  cycleCount = 0;
  counterDisplay.textContent = 'Cycles: 0';
  isInhale = false;

  interval = setInterval(updateBreathingText, 4000);
  circle.classList.add('animate');
  startBtn.disabled = true;
  stopBtn.disabled = false;
  calmAudio.play();
}

function stopBreathing() {
  clearInterval(interval);
  circle.classList.remove('animate');
  text.textContent = 'Press Start';
  startBtn.disabled = false;
  stopBtn.disabled = true;
  calmAudio.pause();
  calmAudio.currentTime = 0;
}

function toggleSound() {
  isMuted = !isMuted;
  calmAudio.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇 Sound Off' : '🔊 Sound On';
}

// Button listeners
startBtn.addEventListener('click', startBreathing);
stopBtn.addEventListener('click', stopBreathing);
muteBtn.addEventListener('click', toggleSound);
