document.addEventListener('DOMContentLoaded', () => {
    const digitalClock = document.getElementById('digitalClock');
    const currentDateElement = document.getElementById('currentDate'); // Get date element
    const themeButtons = document.querySelectorAll('.theme-btn');

    let currentTheme = localStorage.getItem('theme') || 'default';

    // --- Clock Functions ---
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

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
    }

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