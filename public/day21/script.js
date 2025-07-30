
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
