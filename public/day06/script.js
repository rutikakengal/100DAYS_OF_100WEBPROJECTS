// ---------------- FIREWORKS ---------------- //
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

class Firework {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
    this.life = 0;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.005;
    this.life++;
    this.draw();
  }
}

function createFireworks(x, y) {
  const colors = ["#ff4747", "#ffd700", "#47ff85", "#47b8ff", "#ff47ec"];
  const particleCount = 80;
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2) / particleCount * i;
    const speed = Math.random() * 4 + 1;
    fireworks.push(new Firework(x, y, 3, colors[Math.floor(Math.random() * colors.length)], {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    }));
  }
}

function animateFireworks() {
  requestAnimationFrame(animateFireworks);
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((firework, index) => {
    if (firework.alpha <= 0) {
      fireworks.splice(index, 1);
    } else {
      firework.update();
    }
  });
}

setInterval(() => {
  createFireworks(Math.random() * canvas.width, Math.random() * canvas.height / 2);
}, 1500);

animateFireworks();

// ---------------- COUNTDOWN ---------------- //
function updateCountdown() {
  const newYear = new Date("January 1, 2026 00:00:00").getTime();
  const now = new Date().getTime();
  const diff = newYear - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = String(hours).padStart(2, "0");
  document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
  document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();
