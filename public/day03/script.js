
// API Key - Replace with your own OpenWeatherMap API key
const API_KEY = 'b650bad13346ff25db59174f2e395ed6';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create floating dots
    createFloatingDots();
    
    // Start typewriter effect
    startTypewriter();
    
    // Load default weather
    fetchWeatherData('London')
        .then(displayWeatherData)
        .catch(error => console.error('Error loading default city:', error));
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up sound control
    setupSoundControl();
});

// Create floating dots within card
function createFloatingDots() {
    const cardDots = document.getElementById('card-dots');
    const dotsCount = 20;
    
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        
        // Position within card (not too close to edges)
        dot.style.left = `${10 + Math.random() * 80}%`;
        dot.style.top = `${10 + Math.random() * 80}%`;
        
        // Random size and appearance
        const size = Math.random() * 8 + 3;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Random animation
        dot.style.animationDuration = `${Math.random() * 15 + 10}s`;
        dot.style.animationDelay = `${Math.random() * 5}s`;
        
        cardDots.appendChild(dot);
    }
}

// Typewriter effect
function startTypewriter() {
    const text = "Windy";
    const element = document.getElementById('typewriter');
    let i = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    function type() {
        const currentText = text.substring(0, i);
        element.textContent = currentText;
        
        if (!isDeleting && i < text.length) {
            i++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && i > 0) {
            i--;
            setTimeout(type, typingSpeed / 2);
        } else {
            isDeleting = !isDeleting;
            setTimeout(type, isDeleting ? 1500 : typingSpeed);
        }
    }
    
    type();
}

// Set up event listeners
function setupEventListeners() {
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location-input');
    
    searchBtn.addEventListener('click', searchWeather);
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchWeather();
    });
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please try another location.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again later.');
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Display weather data in UI
function displayWeatherData(data) {
    document.querySelector('.city').textContent = data.name;
    document.querySelector('.temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.humidity').textContent = `${data.main.humidity}%`;
    document.querySelector('.wind').textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    document.querySelector('.weather-icon').src = 
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.querySelector('.weather-icon').alt = data.weather[0].description;
    
    document.querySelector('.weather-details').style.display = 'block';
    document.querySelector('.app-prompt').style.display = 'none';
}

// Search weather function
function searchWeather() {
    const city = document.getElementById('location-input').value.trim();
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    
    if (city) {
        fetchWeatherData(city)
            .then(displayWeatherData)
            .catch(error => {
                errorElement.textContent = error.message;
                document.querySelector('.search-container').appendChild(errorElement);
                errorElement.style.display = 'block';
                setTimeout(() => {
                    errorElement.style.display = 'none';
                }, 3000);
            });
    } else {
        errorElement.textContent = 'Please enter a city name';
        document.querySelector('.search-container').appendChild(errorElement);
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// Sound control functionality
function setupSoundControl() {
    const soundToggle = document.getElementById('soundToggle');
    const bgSound = document.getElementById('bgSound');
    
    // Set initial state
    bgSound.volume = 0.3; // Set volume to 30%
    bgSound.muted = true; // Start muted
    
    // Add click event listener
    soundToggle.addEventListener('click', function() {
        // Toggle muted state
        bgSound.muted = !bgSound.muted;
        
        // Toggle button class
        soundToggle.classList.toggle('sound-on');
        
        // If unmuting, attempt to play (required by some browsers)
        if (!bgSound.muted) {
            bgSound.play().catch(e => {
                console.log("Audio play failed:", e);
                // If play fails, mute again
                bgSound.muted = true;
                soundToggle.classList.remove('sound-on');
            });
        }
    });
    
    // Initialize sound on user interaction (required by many browsers)
    document.body.addEventListener('click', function initSound() {
        // This will only run once
        document.body.removeEventListener('click', initSound);
        
        // Try to play (but keep muted if that was the previous state)
        bgSound.play().then(() => {
            if (bgSound.muted) {
                bgSound.pause();
            }
        }).catch(e => console.log("Initial audio play failed:", e));
    }, { once: true });
}

const apiKey = "acbad005e3ba2c55338047e9b01385b8";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const toggleForecastBtn = document.getElementById("toggle-forecast");
const forecastContainer = document.getElementById("forecast-container");

let isForecastVisible = false;

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    // Check for geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Default city if geolocation is denied
                checkWeather("Mathura");
            }
        );
    } else {
        // Default city if geolocation is not supported
        checkWeather("Mathura");
    }
});

// Search button click event
searchBtn.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
        checkWeather(city);
    }
});

// Enter key press event
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = searchInput.value.trim();
        if (city) {
            checkWeather(city);
        }
    }
});

// Toggle forecast visibility
toggleForecastBtn.addEventListener("click", () => {
    isForecastVisible = !isForecastVisible;
    forecastContainer.style.display = isForecastVisible ? "grid" : "none";
    toggleForecastBtn.innerHTML = isForecastVisible 
        ? "Hide 5-Day Forecast <i class='fas fa-chevron-up'></i>"
        : "Show 5-Day Forecast <i class='fas fa-chevron-down'></i>";
});

async function checkWeather(city) {
    showLoader();
    hideError();
    hideWeather();

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (response.status === 404) {
            showError();
            hideLoader();
            return;
        }

        const data = await response.json();
        displayWeather(data);
        await displayForecast(city);
        hideLoader();
    } catch (error) {
        showError();
        hideLoader();
        console.error("Error fetching weather data:", error);
    }
}

async function getWeatherByCoords(lat, lon) {
    showLoader();
    hideError();
    hideWeather();

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        
        if (response.status === 404) {
            showError();
            hideLoader();
            return;
        }

        const data = await response.json();
        displayWeather(data);
        await displayForecast(data.name);
        hideLoader();
    } catch (error) {
        showError();
        hideLoader();
        console.error("Error fetching weather by coordinates:", error);
    }
}

function displayWeather(data) {
    // Update main weather info
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".feels-like").textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.querySelector(".humidity .value").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind .value").textContent = `${data.wind.speed} km/h`;
    document.querySelector(".pressure .value").textContent = `${data.main.pressure} hPa`;
    document.querySelector(".weather-desc").textContent = data.weather[0].description;

    // Update weather icon
    const weatherMain = data.weather[0].main.toLowerCase();
    weatherIcon.src = `images/${weatherMain}.png`;
    weatherIcon.alt = data.weather[0].description;

    // Update date and time
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector(".date").textContent = now.toLocaleDateString('en-US', options);
    document.querySelector(".time").textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Show weather section
    document.querySelector(".weather").style.display = "block";
}

async function displayForecast(city) {
    try {
        const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        
        // Clear previous forecast
        forecastContainer.innerHTML = "";
        
        // Get forecast for next 5 days (every 24 hours)
        for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const forecastItem = document.createElement("div");
            forecastItem.className = "forecast-item animate__animated animate__fadeIn";
            forecastItem.innerHTML = `
                <div class="forecast-day">${day}</div>
                <img src="images/${forecast.weather[0].main.toLowerCase()}.png" alt="${forecast.weather[0].description}" class="forecast-icon">
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function showLoader() {
    document.querySelector(".loader").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".loader").style.display = "none";
}

function showError() {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
}

function hideError() {
    document.querySelector(".error").style.display = "none";
}

function hideWeather() {
    document.querySelector(".weather").style.display = "none";
}


