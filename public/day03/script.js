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