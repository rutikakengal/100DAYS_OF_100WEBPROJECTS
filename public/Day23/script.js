const display = document.getElementById('display');
let currentInput = '';

function appendNumber(number) {
  if (currentInput === '0' && number !== '.') {
    currentInput = number;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

function appendOperator(operator) {
  if (currentInput === '') return;
  const lastChar = currentInput.slice(-1);
  if ('+-*/'.includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + operator;
  } else {
    currentInput += operator;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function calculate() {
  try {
    currentInput = eval(currentInput).toString();
  } catch {
    currentInput = 'Error';
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentInput || '0';
}

// Optional: keyboard support
document.addEventListener('keydown', (e) => {
  if (!isNaN(e.key) || e.key === '.') {
    appendNumber(e.key);
  } else if ('+-*/'.includes(e.key)) {
    appendOperator(e.key);
  } else if (e.key === 'Enter') {
    calculate();
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  } else if (e.key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
