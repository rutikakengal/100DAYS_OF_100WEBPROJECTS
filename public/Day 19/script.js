document.addEventListener('DOMContentLoaded', () => {
    const digitalClock = document.getElementById('digitalClock');
    const currentDateElement = document.getElementById('currentDate');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const backgroundInteractionZone = document.querySelector('.background-interaction-zone');
    const chimeSound = document.getElementById('chimeSound');

    let currentTheme = localStorage.getItem('theme') || 'default';
    let lastHour = -1;

    //show clock & date
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        applyDayNightMode(hours); //change day or night mode depending on hour

        //play sound on every new hour
        if (minutes === 0 && seconds === 0 && hours !== lastHour) {
            playChimeSound();
            lastHour = hours;
        } else if (minutes !== 0 || seconds !== 0) {
            lastHour = -1; //reset hour tracker if not at exact hour
        }

        //format time to 12-hour with am/pm
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        //add leading zeros
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        digitalClock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

        //format date in readable format
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = now.toLocaleDateString(undefined, options);
    }

    //apply theme when user clicks a button
    function applyTheme(themeName) {
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);
        currentTheme = themeName;
        localStorage.setItem('theme', themeName);

        //update active button style
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.theme === themeName) {
                button.classList.add('active');
            }
        });

        updateClock(); //update mode again after changing theme
    }

    //switch between day and night styles based on hour
    function applyDayNightMode(currentHours) {
        if (currentHours >= 6 && currentHours < 18) {
            document.body.classList.remove('night-mode');
            document.body.classList.add('day-mode');
        } else {
            document.body.classList.remove('day-mode');
            document.body.classList.add('night-mode');
        }
    }

    //play hourly chime sound
    function playChimeSound() {
        if (chimeSound) {
            chimeSound.currentTime = 0;
            chimeSound.play().catch(e => console.log("chime sound play failed:", e));
        }
    }

    //animate background when mouse moves over the zone
    backgroundInteractionZone.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        //shift background gradient angle slightly
        document.body.style.setProperty('--default-gradient-angle', `${135 + (x * 5)}deg`);

        //move background image if any
        document.body.style.backgroundPosition = `${x * 10}px ${y * 10}px`;

        //move custom doodles
        document.body.style.setProperty('--doodle-transform-x', `${x * 10}px`);
        document.body.style.setProperty('--doodle-transform-y', `${y * 10}px`);
        document.body.style.setProperty('--doodle-offset-x', `${-x * 20}px`);
        document.body.style.setProperty('--doodle-offset-y', `${-y * 20}px`);
    });

    //reset background effect when mouse leaves the zone
    backgroundInteractionZone.addEventListener('mouseleave', () => {
        document.body.style.setProperty('--doodle-offset-x', `0px`);
        document.body.style.setProperty('--doodle-offset-y', `0px`);
    });

    //change theme when a theme button is clicked
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.dataset.theme;
            applyTheme(theme);
        });
    });

    //initialize clock and theme on page load
    applyTheme(currentTheme);
    updateClock();
    setInterval(updateClock, 1000);
});