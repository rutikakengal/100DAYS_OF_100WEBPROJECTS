// Character sets
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+[]{}|;:,.<>?/~";

// DOM Elements
const passwordOutput = document.getElementById("passwordOutput");
const passwordLengthSlider = document.getElementById("passwordLength");
const lengthDisplay = document.getElementById("lengthDisplay");
const includeUppercase = document.getElementById("includeUppercase");
const includeLowercase = document.getElementById("includeLowercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const strengthText = document.getElementById("passwordStrength");
const strengthBar = document.getElementById("strengthLevel");

// Update password length label
passwordLengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = passwordLengthSlider.value;
});

// Generate password on click
generateBtn.addEventListener("click", () => {
  const length = +passwordLengthSlider.value;
  const hasUpper = includeUppercase.checked;
  const hasLower = includeLowercase.checked;
  const hasNumber = includeNumbers.checked;
  const hasSymbol = includeSymbols.checked;

  const password = generatePassword(length, hasUpper, hasLower, hasNumber, hasSymbol);
  passwordOutput.value = password;
  updateStrengthIndicator(password);
});

// Copy password to clipboard
copyBtn.addEventListener("click", () => {
  if (passwordOutput.value !== "") {
    navigator.clipboard.writeText(passwordOutput.value);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Password";
    }, 1500);
  }
});

// Generate Password Logic
function generatePassword(length, upper, lower, number, symbol) {
  let charSet = "";
  if (upper) charSet += UPPERCASE;
  if (lower) charSet += LOWERCASE;
  if (number) charSet += NUMBERS;
  if (symbol) charSet += SYMBOLS;

  if (charSet.length === 0) return "Please select at least one option";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
    password += randomChar;
  }
  return password;
}

// Strength Indicator Logic
function updateStrengthIndicator(password) {
  let strength = 0;
  const length = password.length;

  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (length >= 12 && strength >= 3) {
    strengthBar.className = "strength-fill strong";
    strengthText.textContent = "Strong";
  } else if (length >= 8 && strength >= 2) {
    strengthBar.className = "strength-fill medium";
    strengthText.textContent = "Medium";
  } else {
    strengthBar.className = "strength-fill weak";
    strengthText.textContent = "Weak";
  }
}