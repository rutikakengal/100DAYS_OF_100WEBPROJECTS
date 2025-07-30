
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const playerSpan = document.getElementById('player');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset');

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      message.textContent = `🎉 Player ${board[a]} wins!`;
      isGameActive = false;
      return true;
    }
  }

  if (!board.includes("")) {
    message.textContent = "😐 It's a tie!";
    isGameActive = false;
    return true;
  }

  return false;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] === "" && isGameActive) {
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (!checkWinner()) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      playerSpan.textContent = currentPlayer;
    }
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  cells.forEach(cell => (cell.textContent = ""));
  playerSpan.textContent = currentPlayer;
  message.textContent = "";
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);

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

