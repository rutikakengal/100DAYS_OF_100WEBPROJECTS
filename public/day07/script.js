
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");
const modeLabel = document.getElementById("mode");

let isFocus = true;
let interval = null;
let remainingSeconds = 0;

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  modeLabel.textContent = isFocus ? "Focus" : "Break";
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      isFocus = !isFocus;
      remainingSeconds = (isFocus ? parseInt(focusInput.value) : parseInt(breakInput.value)) * 60;
      updateDisplay();
      startTimer(); // auto-start next session
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isFocus = true;
  remainingSeconds = parseInt(focusInput.value) * 60;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
focusInput.addEventListener("change", resetTimer);
breakInput.addEventListener("change", resetTimer);

resetTimer(); // Set initial state
=======
class BMICalculator {
  constructor() {
    this.currentUnit = "metric";
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.form = document.getElementById("bmi-form");
    this.heightInput = document.getElementById("height");
    this.weightInput = document.getElementById("weight");
    this.calculateBtn = document.getElementById("calculate-btn");
    this.resultContainer = document.getElementById("result-container");
    this.bmiValue = document.getElementById("bmi-value");
    this.bmiCategory = document.getElementById("bmi-category");
    this.bmiInfo = document.getElementById("bmi-info");
    this.unitToggle = document.querySelector(".unit-toggle");
    this.heightLabel = document.getElementById("height-label");
    this.weightLabel = document.getElementById("weight-label");
    this.heightUnit = document.getElementById("height-unit");
    this.weightUnit = document.getElementById("weight-unit");
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.unitToggle.addEventListener("click", (e) => this.handleUnitToggle(e));

    // Real-time validation
    this.heightInput.addEventListener("input", () => this.validateInput());
    this.weightInput.addEventListener("input", () => this.validateInput());
  }

  handleUnitToggle(e) {
    if (e.target.classList.contains("unit-option")) {
      const newUnit = e.target.dataset.unit;
      if (newUnit !== this.currentUnit) {
        this.switchUnit(newUnit);
        this.updateActiveUnit(e.target);
        this.clearResults();
      }
    }
  }

  switchUnit(unit) {
    this.currentUnit = unit;

    if (unit === "metric") {
      this.heightLabel.textContent = "Height";
      this.weightLabel.textContent = "Weight";
      this.heightUnit.textContent = "cm";
      this.weightUnit.textContent = "kg";
      this.heightInput.placeholder = "e.g., 170";
      this.weightInput.placeholder = "e.g., 70";
    } else {
      this.heightLabel.textContent = "Height";
      this.weightLabel.textContent = "Weight";
      this.heightUnit.textContent = "inches";
      this.weightUnit.textContent = "lbs";
      this.heightInput.placeholder = "e.g., 67";
      this.weightInput.placeholder = "e.g., 154";
    }

    this.heightInput.value = "";
    this.weightInput.value = "";
  }

  updateActiveUnit(activeElement) {
    document
      .querySelectorAll(".unit-option")
      .forEach((el) => el.classList.remove("active"));
    activeElement.classList.add("active");
  }

  validateInput() {
    const height = parseFloat(this.heightInput.value);
    const weight = parseFloat(this.weightInput.value);

    const isValid =
      height > 0 &&
      weight > 0 &&
      (this.currentUnit === "metric"
        ? height >= 50 && height <= 300 && weight >= 20 && weight <= 300
        : height >= 20 && height <= 120 && weight >= 44 && weight <= 660);

    this.calculateBtn.style.opacity = isValid ? "1" : "0.7";
    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateInput()) {
      this.showError("Please enter valid height and weight values.");
      return;
    }

    this.showLoading();

    // Simulate calculation delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const height = parseFloat(this.heightInput.value);
    const weight = parseFloat(this.weightInput.value);

    try {
      const bmi = this.calculateBMI(height, weight);
      const category = this.getBMICategory(bmi);
      const info = this.getBMIInfo(category);

      this.displayResult(bmi, category, info);
    } catch (error) {
      this.showError("An error occurred during calculation. Please try again.");
    } finally {
      this.hideLoading();
    }
  }

  calculateBMI(height, weight) {
    let heightInMeters;
    let weightInKg;

    if (this.currentUnit === "metric") {
      heightInMeters = height / 100; // cm to meters
      weightInKg = weight;
    } else {
      heightInMeters = height * 0.0254; // inches to meters
      weightInKg = weight * 0.453592; // pounds to kg
    }

    return weightInKg / (heightInMeters * heightInMeters);
  }

  getBMICategory(bmi) {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obese";
  }

  getBMIInfo(category) {
    const info = {
      underweight:
        "You may want to gain weight. Consider consulting a healthcare professional for personalized advice.",
      normal:
        "You have a healthy body weight! Keep up the good work with a balanced diet and regular exercise.",
      overweight:
        "You may want to lose some weight. Consider a balanced diet and regular physical activity.",
      obese:
        "Consider consulting a healthcare professional for personalized weight management advice.",
    };
    return info[category];
  }

  displayResult(bmi, category, info) {
    this.bmiValue.textContent = bmi.toFixed(1);

    const categoryNames = {
      underweight: "Underweight",
      normal: "Normal Weight",
      overweight: "Overweight",
      obese: "Obese",
    };

    this.bmiCategory.textContent = categoryNames[category];
    this.bmiCategory.className = `bmi-category ${category}`;
    this.bmiInfo.textContent = info;

    this.resultContainer.classList.add("show");
    this.resultContainer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  showError(message) {
    this.resultContainer.innerHTML = `<div class="error-message">${message}</div>`;
    this.resultContainer.classList.add("show");
  }

  showLoading() {
    this.calculateBtn.classList.add("loading");
    this.calculateBtn.textContent = "";
  }

  hideLoading() {
    this.calculateBtn.classList.remove("loading");
    this.calculateBtn.textContent = "Calculate BMI";
  }

  clearResults() {
    this.resultContainer.classList.remove("show");
  }
}

// Initialize the calculator when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new BMICalculator();
});

const img = document.getElementById('img')
const btn = document.getElementById('btn')

const GET_API = 'https://api.thecatapi.com/v1/images/search'

async function fetchImg() {
    try {
        const res = await fetch(GET_API)
        const data = await res.json()
        // const i = Math.floor(Math.random()*data.length) 
        // const result =data[i]
        img.style.backgroundImage = `url(${data[0].url})`
    }
    catch(error){
        img.innerText="Failed to fetch Image"
    }

}

btn.addEventListener('click', fetchImg)
