document.addEventListener('DOMContentLoaded', () => {
    const digitalClock = document.getElementById('digitalClock');
    const currentDateElement = document.getElementById('currentDate');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const particleContainer = document.getElementById('particle-container');
    const chimeSound = document.getElementById('chimeSound');
    const customCursor = document.getElementById('customCursor');

    let currentTheme = localStorage.getItem('theme') || 'default';
    let lastHour = -1;
    const particles = [];
    const NUM_PARTICLES = 30;

    // --- Particle Management Functions ---
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particleContainer.appendChild(particle);

        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        const animationDuration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const directionX = (Math.random() - 0.5) * 2;
        const directionY = (Math.random() - 0.5) * 2;
        const floatDistance = Math.random() * 50 + 20;

        const styleSheet = document.styleSheets[0];
        const keyframesName = `floatParticle_${particles.length}`;

        const keyframesRule = `@keyframes ${keyframesName} {
            0% { transform: translate(0, 0); opacity: 0.8; }
            50% { transform: translate(${floatDistance * directionX}px, ${floatDistance * directionY}px); opacity: 1; }
            100% { transform: translate(0, 0); opacity: 0.8; }
        }`;
        styleSheet.insertRule(keyframesRule, styleSheet.cssRules.length);

        particle.style.animation = `${keyframesName} ${animationDuration}s infinite ease-in-out ${delay}s alternate`;

        particles.push(particle);
    }

    function initializeParticles() {
        for (let i = 0; i < NUM_PARTICLES; i++) {
            createParticle();
        }
    }

    function animateParticles(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        particles.forEach(particle => {
            const speed = parseFloat(particle.style.width) / 10;
            particle.style.transform = `translate(${x * speed * 20}px, ${y * speed * 20}px)`;
        });

        // Parallax for background doodles
        document.body.style.setProperty('--doodle-offset-x', `${-x * 20}px`);
        document.body.style.setProperty('--doodle-offset-y', `${-y * 20}px`);
    }

    // --- Clock & Date Functions ---
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        applyDayNightMode(hours);

        if (minutes === 0 && seconds === 0 && hours !== lastHour) {
            playChimeSound();
            lastHour = hours;
        } else if (minutes !== 0 || seconds !== 0) {
            lastHour = -1;
        }

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        digitalClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = now.toLocaleDateString(undefined, options);
    }

    // --- Theme Functions ---
    function applyTheme(themeName) {
        document.body.className = ''; // Clear existing theme and day/night classes
        document.body.classList.add(`theme-${themeName}`);
        currentTheme = themeName;
        localStorage.setItem('theme', themeName);

        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === themeName) {
                button.classList.add('active');
            }
        });
        updateClock(); // Re-run clock update to apply correct day/night class for the new theme
    }

    // --- Day/Night Mode Function ---
    function applyDayNightMode(currentHours) {
        const body = document.body;
        body.classList.remove('day-mode', 'night-mode');

        if (currentHours >= 6 && currentHours < 18) {
            body.classList.add('day-mode');
        } else {
            body.classList.add('night-mode');
        }
    }

    // --- Sound Effects ---
    function playChimeSound() {
        if (chimeSound) {
            chimeSound.currentTime = 0;
            chimeSound.play().catch(e => console.error("Chime sound play failed:", e));
        }
    }

    // --- Custom Cursor Logic ---
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });
        document.body.style.cursor = 'none'; // Hide default cursor
    }

    // --- Event Listeners ---
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            applyTheme(theme);
        });
    });

    particleContainer.addEventListener('mousemove', animateParticles);
    particleContainer.addEventListener('mouseleave', () => {
        particles.forEach(particle => {
            particle.style.transform = `translate(0, 0)`;
        });
        // Reset doodle parallax
        document.body.style.setProperty('--doodle-offset-x', `0px`);
        document.body.style.setProperty('--doodle-offset-y', `0px`);
    });

    // --- Initializations ---
    applyTheme(currentTheme);
    initializeParticles();
    updateClock();
    setInterval(updateClock, 1000);
});
=======

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

    let unitSymbol = {
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
