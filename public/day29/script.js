const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");

// List of common currencies
const currencyList = ["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "BRL"];

// Populate dropdowns
currencyList.forEach(code => {
  const option1 = document.createElement("option");
  option1.value = option1.textContent = code;
  fromCurrency.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = option2.textContent = code;
  toCurrency.appendChild(option2);
});

fromCurrency.value = "USD";
toCurrency.value = "INR";

// Currency Conversion
async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    result.textContent = "Please enter a valid amount.";
    return;
  }

  const apiKey = "https://api.exchangerate-api.com/v4/latest/" + from;

  try {
    const res = await fetch(apiKey);
    const data = await res.json();

    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(2);

    result.textContent = `${amount} ${from} = ${converted} ${to}`;
  } catch (error) {
    result.textContent = "Conversion failed. Try again later.";
    console.error(error);
  }
}