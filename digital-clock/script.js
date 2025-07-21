document.addEventListener('DOMContentLoaded', () => {
    const digitalClock = document.getElementById('digitalClock');
    const currentDateElement = document.getElementById('currentDate');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const backgroundInteractionZone = document.querySelector('.background-interaction-zone');
    const backgroundDoodles = document.querySelectorAll('body::before, body::after'); // Select pseudo-elements
    const chimeSound = document.getElementById('chimeSound');

    let currentTheme = localStorage.getItem('theme') || 'default';
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
        document.body.className = ''; // Clear existing theme classes
        document.body.classList.add(`theme-${themeName}`);
        currentTheme = themeName;
        localStorage.setItem('theme', themeName); // Save selected theme

        // Update active state for buttons
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === themeName) {
                button.classList.add('active');
            }
        });
        updateClock(); // Re-apply day/night mode after theme change
    }

    // --- Day/Night Mode Function ---
    function applyDayNightMode(currentHours) {
        const body = document.body;
        // Example: Day from 6 AM to 6 PM, Night otherwise
        if (currentHours >= 6 && currentHours < 18) {
            body.classList.remove('night-mode');
            body.classList.add('day-mode'); // Optional: if you want specific day-mode styles
        } else {
            body.classList.remove('day-mode');
            body.classList.add('night-mode');
        }
    }

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


    // --- Custom Cursor (Optional JavaScript logic) ---
    /*
    const customCursor = document.getElementById('customCursor');
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });
        // Hide default cursor
        document.body.style.cursor = 'none';
    }
    */

    // --- Event Listeners ---
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            applyTheme(theme);
        });
    });

    // --- Initializations ---
    // Apply the saved theme on load
    applyTheme(currentTheme);
    // Update the clock and date immediately and then every second
    updateClock();
    setInterval(updateClock, 1000); // Update every 1000 milliseconds (1 second)
});