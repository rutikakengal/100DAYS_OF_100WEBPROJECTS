// Mobile Navigation Toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  });
}
if (close) {
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  });
}

// Hero Section Typing Animation
document.addEventListener('DOMContentLoaded', () => {
  new TypeIt("#typing-animation", {
    strings: ["Design Redefined.", "Future-Forward Fashion.", "Discover the Aurora Collection."],
    speed: 100,
    breakLines: false,
    waitUntilVisible: true,
    loop: true,
    lifeLike: true,
    cursorChar: '▋'
  }).go();
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1
});
revealElements.forEach(el => {
  revealObserver.observe(el);
});

// Temperature Converter
const tempEl = document.getElementById("temp-ip-el");
const inputEl = document.getElementById("temp-ip");
const outputEl = document.getElementById("temp-op");
const btnEl = document.getElementById("temp-btn");
const displayEl = document.getElementById("display");
const resetBtn = document.getElementById("reset-btn");

btnEl.addEventListener('click', function(event) {
  event.preventDefault();

  let temp = parseFloat(tempEl.value);
  let input = inputEl.value;
  let output = outputEl.value;

  if (isNaN(temp)) {
    displayEl.textContent = "❌ Please enter a valid number for temperature.";
    return;
  }

  if (input === "0" || output === "0") {
    displayEl.textContent = "⚠️ Please select both input and output temperature units.";
    return;
  }

  let result;

  if (input === output) {
    result = temp;
  } else if (input === "C" && output === "F") {
    result = (temp * 9/5) + 32;
  } else if (input === "F" && output === "C") {
    result = (temp - 32) * 5/9;
  } else if (input === "C" && output === "K") {
    result = temp + 273.15;
  } else if (input === "K" && output === "C") {
    result = temp - 273.15;
  } else if (input === "F" && output === "K") {
    result = (temp - 32) * 5/9 + 273.15;
  } else if (input === "K" && output === "F") {
    result = (temp - 273.15) * 9/5 + 32;
  } else {
    displayEl.textContent = "🚫 Invalid conversion.";
    return;
  }

  const unitSymbol = {
    "C": "°C",
    "F": "°F",
    "K": "K"
  };

  displayEl.textContent = `✅ Converted Temperature: ${result.toFixed(2)} ${unitSymbol[output]}`;
});

resetBtn.addEventListener("click", () => {
  tempEl.value = "";
  inputEl.selectedIndex = 0;
  outputEl.selectedIndex = 0;
  displayEl.textContent = "";
});
