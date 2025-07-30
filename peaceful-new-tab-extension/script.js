document.addEventListener('DOMContentLoaded', () => {
    const greetingEl = document.getElementById('greeting');

    // Check if name is already stored
    let userName = localStorage.getItem('userName');

    // If not stored, ask user and save it
    if (!userName) {
        userName = prompt("Hi there! What's your name?");
        if (userName) {
            localStorage.setItem('userName', userName);
        } else {
            userName = "friend"; // Fallback if user clicks cancel
        }
    }

    const now = new Date();
    const hour = now.getHours();

    let greetingText = "";

    if (hour >= 5 && hour < 12) {
        greetingText = `Good Morning, ${userName}! ☀️`;
    } else if (hour >= 12 && hour < 17) {
        greetingText = `Good Afternoon, ${userName}! 🌤️`;
    } else if (hour >= 17 && hour < 21) {
        greetingText = `Good Evening, ${userName}! 🌇`;
    } else {
        greetingText = `Working late, ${userName}? 🌙`;
    }

    greetingEl.textContent = greetingText;
});
