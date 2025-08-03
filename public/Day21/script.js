<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    let currentTheme = localStorage.getItem('theme') || 'default';
    const digitalClock = document.getElementById('digitalClock');
    const currentDateElement = document.getElementById('currentDate');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const backgroundInteractionZone = document.querySelector('.background-interaction-zone');
    const backgroundDoodles = document.querySelectorAll('body::before, body::after'); // Select pseudo-elements
    const chimeSound = document.getElementById('chimeSound');

    let lastHour = -1; // To track hour change for chime

    // --- Clock & Date Functions ---
    function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Check for day/night mode based on time
    applyDayNightMode(hours);

    // Chime on the hour
    if (minutes === 0 && seconds === 0 && hours !== lastHour) {
        playChimeSound();
        lastHour = hours;
    } else if (minutes !== 0 || seconds !== 0) {
        // Reset lastHour when not on the hour to allow chime next time it hits zero minutes/seconds
        lastHour = -1;
    }

    // Format for 12-hour display with AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    // Pad with leading zeros
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    digitalClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Update Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString(undefined, options);
}


    // --- Theme Functions ---
    function applyTheme(themeName) {
        document.body.classList.remove("theme-default", "theme-ocean", "theme-sunset", "theme-forest");
        document.body.classList.add(`theme-${themeName}`);
        currentTheme = themeName;
        localStorage.setItem('theme', themeName);

        // Mark active button
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === themeName);
        });

        // Always reapply day/night mode (so colors combine correctly)
        applyDayNightMode(new Date().getHours());
        }

        // Day/Night mode handling (never clears any themes)
        function applyDayNightMode(hours) {
        document.body.classList.toggle("day-mode", hours >= 6 && hours < 18);
        document.body.classList.toggle("night-mode", !(hours >= 6 && hours < 18));
        }

        // Attach event listeners ONCE, at top level
        themeButtons.forEach(btn => {
        btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });

    // --- Sound Effects ---
    function playChimeSound() {
        if (chimeSound) {
            chimeSound.currentTime = 0; // Rewind to start if playing
            chimeSound.play().catch(e => console.log("Chime sound play failed:", e)); // Catch potential errors
        }
    }

    // --- Interactive Background Doodles ---
    // Note: Direct manipulation of ::before/::after from JS is not straightforward.
    // Instead, we can adjust CSS variables that they use or apply transforms to the body itself.
    // For this effect, we'll apply a slight transform to the body based on mouse position.

    backgroundInteractionZone.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1 for x
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1 for y

        // Apply slight perspective and rotation to the body for a subtle parallax effect
        // This will make the background elements appear to shift relative to the container
        document.body.style.setProperty('--default-gradient-angle', `${135 + (x * 5)}deg`); // Adjust gradient angle
        document.body.style.backgroundPosition = `${x * 10}px ${y * 10}px`; // Shift background-image if one were used
        // Or, more directly move the doodles
        document.body.style.setProperty('--doodle-transform-x', `${x * 10}px`);
        document.body.style.setProperty('--doodle-transform-y', `${y * 10}px`);

        // To make the actual ::before and ::after elements move, you'd need to set custom properties
        // on body that these pseudo-elements can then use for their transform.
        // Let's add that to the CSS variables and update here:
        document.body.style.setProperty('--doodle-offset-x', `${-x * 20}px`);
        document.body.style.setProperty('--doodle-offset-y', `${-y * 20}px`);
    });

    // Reset doodles when mouse leaves
    backgroundInteractionZone.addEventListener('mouseleave', () => {
        document.body.style.setProperty('--doodle-offset-x', `0px`);
        document.body.style.setProperty('--doodle-offset-y', `0px`);
    });

    // --- Initializations ---
    // Apply the saved theme on load
    applyTheme(currentTheme);
    // Update the clock and date immediately and then every second
    updateClock();
    setInterval(updateClock, 1000); // Update every 1000 milliseconds (1 second)

    // --- Stopwatch Functionality ---
let stopwatchTime = 0;
let stopwatchInterval = null;
let isRunning = false;

const flipBtn = document.getElementById('flipToStopwatch');
const clockContainer = document.querySelector('.container:not(.stopwatch-container)');
const stopwatchContainer = document.getElementById('stopwatchContainer');
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.getElementById('backToClockBtn');

// Flip to Stopwatch
flipBtn.addEventListener('click', () => {
    clockContainer.style.animation = 'flipToStopwatch 0.6s ease forwards';
    flipBtn.style.display = 'none';
    
    setTimeout(() => {
        clockContainer.style.display = 'none';
        stopwatchContainer.style.display = 'flex';
        stopwatchContainer.style.animation = 'flipToClock 0.6s ease forwards';
    }, 300);
});

// Back to Clock
backBtn.addEventListener('click', () => {
    stopwatchContainer.style.animation = 'flipToStopwatch 0.6s ease forwards';
    
    setTimeout(() => {
        stopwatchContainer.style.display = 'none';
        clockContainer.style.display = 'flex';
        clockContainer.style.animation = 'flipToClock 0.6s ease forwards';
        flipBtn.style.display = 'flex';
    }, 300);
});

// Start/Pause Stopwatch
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        startStopwatch();
        startBtn.textContent = 'Pause';
        startBtn.classList.add('running');
    } else {
        pauseStopwatch();
        startBtn.textContent = 'Start';
        startBtn.classList.remove('running');
    }
});

// Reset Stopwatch
resetBtn.addEventListener('click', () => {
    resetStopwatch();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
});

function startStopwatch() {
    isRunning = true;
    stopwatchInterval = setInterval(() => {
        stopwatchTime += 10; // Increment by 10ms for smooth display
        updateStopwatchDisplay();
    }, 10);
}

function pauseStopwatch() {
    isRunning = false;
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const totalMs = stopwatchTime;
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const centiseconds = Math.floor((totalMs % 1000) / 10);
    
    const formattedTime = 
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}:` +
        `${centiseconds.toString().padStart(2, '0')}`;
    
    stopwatchDisplay.textContent = formattedTime;
}

// Initialize stopwatch display
updateStopwatchDisplay();


});
=======
let tog = 1
let rollingSound = new Audio('dice-rolling.mp3')
let winSound = new Audio('win-sound.mp3')
let p1sum = 0
let p2sum = 0

function play(player, psum, correction, num) {
    let sum
    if (psum == 'p1sum') {
        p1sum = p1sum + num

        if (p1sum > 100) {
            p1sum = p1sum - num
        }

        if (p1sum == 1) {
            p1sum = 38
        }
        if (p1sum == 4) {
            p1sum = 14
        }
        if (p1sum == 8) {
            p1sum = 30
        }
        if (p1sum == 21) {
            p1sum = 42
        }
        if (p1sum == 28) {
            p1sum = 76
        }
        if (p1sum == 32) {
            p1sum = 10
        }
        if (p1sum == 36) {
            p1sum = 6
        }
        if (p1sum == 48) {
            p1sum = 26
        }
        if (p1sum == 50) {
            p1sum = 67
        }
        if (p1sum == 62) {
            p1sum = 18
        }
        if (p1sum == 71) {
            p1sum = 92
        }
        if (p1sum == 80) {
            p1sum = 99
        }
        if (p1sum == 88) {
            p1sum = 24
        }
        if (p1sum == 95) {
            p1sum = 56
        }
        if (p1sum == 97) {
            p1sum = 78
        }

        sum = p1sum
    }

    if (psum == 'p2sum') {
        p2sum = p2sum + num

        if (p2sum > 100) {
            p2sum = p2sum - num
        }
        
        if (p2sum == 1) {
            p2sum = 38
        }
        if (p2sum == 4) {
            p2sum = 14
        }
        if (p2sum == 8) {
            p2sum = 30
        }
        if (p2sum == 21) {
            p2sum = 42
        }
        if (p2sum == 28) {
            p2sum = 76
        }
        if (p2sum == 32) {
            p2sum = 10
        }
        if (p2sum == 36) {
            p2sum = 6
        }
        if (p2sum == 48) {
            p2sum = 26
        }
        if (p2sum == 50) {
            p2sum = 67
        }
        if (p2sum == 62) {
            p2sum = 18
        }
        if (p2sum == 71) {
            p2sum = 92
        }
        if (p2sum == 80) {
            p2sum = 99
        }
        if (p2sum == 88) {
            p2sum = 24
        }
        if (p2sum == 95) {
            p2sum = 56
        }
        if (p2sum == 97) {
            p2sum = 78
        }
        sum = p2sum
    }
    document.getElementById(`${player}`).style.transition = `linear all .5s`

    if (sum < 10) {
        document.getElementById(`${player}`).style.left = `${(sum - 1) * 62}px`
        document.getElementById(`${player}`).style.top = `${-0 * 62 - correction}px`
    }

    else if (sum == 100) {
        winSound.play()
        if (player == 'p1') {
            alert("Red Won !!")
        }
        else if (player == 'p2') {
            alert("Yellow Won !!")
        }
        location.reload()
    }

    else {
        numarr = Array.from(String(sum))
        n1 = eval(numarr.shift())
        n2 = eval(numarr.pop())

        if (n1 % 2 != 0) {
            if (n2 == 0) {
                document.getElementById(`${player}`).style.left = `${(9) * 62}px`
                document.getElementById(`${player}`).style.top = `${(-n1 + 1) * 62 - correction}px`
            }
            else {
                document.getElementById(`${player}`).style.left = `${(9 - (n2 - 1)) * 62}px`
                document.getElementById(`${player}`).style.top = `${-n1 * 62 - correction}px`
            }
        }

        else if (n1 % 2 == 0) {
            if (n2 == 0) {
                document.getElementById(`${player}`).style.left = `${(0) * 62}px`
                document.getElementById(`${player}`).style.top = `${(-n1 + 1) * 62 - correction}px`
            }
            else {
                document.getElementById(`${player}`).style.left = `${(n2 - 1) * 62}px`
                document.getElementById(`${player}`).style.top = `${-n1 * 62 - correction}px`
            }
        }
    }
}

document.getElementById("diceBtn").addEventListener("click", function () {
    rollingSound.play()
    num = Math.floor(Math.random() * (6 - 1 + 1) + 1)
    document.getElementById("dice").innerText = num

    if (tog % 2 != 0) {
        document.getElementById('tog').innerText = "Yellow's Turn : "
        play('p1', 'p1sum', 0, num)

    }

    else if (tog % 2 == 0) {
        document.getElementById('tog').innerText = "Red's Turn : "
        play('p2', 'p2sum', 55, num)
    }

    tog = tog + 1
})
>>>>>>> upstream/main
