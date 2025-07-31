// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const greetingElement = document.getElementById("greeting");
    const resetBtn = document.getElementById("resetNameBtn");

    // Replace with your actual Pexels API key
    const PEXELS_API_KEY = "[REDACTED_PEXELS_KEY]";

    // Helper function to update greeting
    function updateGreeting(name) {
        const now = new Date();
        const hour = now.getHours();
        let greetingText = "Hello";

        if (hour >= 5 && hour < 12) {
            greetingText = `Good Morning, ${name}! ☀️`;
        } else if (hour >= 12 && hour < 17) {
            greetingText = `Good Afternoon, ${name}! 🌤️`;
        } else if (hour >= 17 && hour < 21) {
            greetingText = `Good Evening, ${name}! 🌇`;
        } else {
            greetingText = `Working late, ${name}? 🌙`;
        }

        greetingElement.textContent = `${greetingText}`;
    }

    // Get the stored name
    chrome.storage.sync.get(["userName"], (result) => {
        if (result.userName) {
            updateGreeting(result.userName);
            resetBtn.style.display = "inline-block"; // Show reset button
        } else {
            const userName = prompt("What's your name?");
            if (userName) {
                chrome.storage.sync.set({ userName: userName }, () => {
                    updateGreeting(userName);
                    resetBtn.style.display = "inline-block";
                });
            }
        }
    });

    // Handle reset
    resetBtn.addEventListener("click", () => {
        chrome.storage.sync.remove("userName", () => {
            location.reload();
        });
    });

    // Fetch a random background image
    async function fetchRandomBackground() {
        const categories = ["nature", "cricket", "technology", "sky", "abstract"];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        const response = await fetch(`https://api.pexels.com/v1/search?query=${randomCategory}&per_page=1&page=${Math.floor(Math.random() * 100)}`, {
            headers: {
                Authorization:"YOUR_PEXELS_API_KEY"
            }
        });
        if (response.ok) {
            const data = await response.json();
            const photo = data.photos[0];
            if (photo?.src?.landscape) {
                document.body.style.backgroundImage = `url(${photo.src.landscape})`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
            }
        } else {
            console.error("Failed to fetch image from Pexels");
        }
    }

    // Load background image on tab load
    fetchRandomBackground();
});
