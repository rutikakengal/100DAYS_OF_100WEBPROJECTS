const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const output = document.querySelector("#output");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  new Choices(select, {
    searchEnabled: true,
    itemSelectText: "",
    shouldSort: true
  });

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Update rate
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const URL = `${BASE_URL}${from}.json`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    const rate = data[from][to];

    const finalAmount = amtVal * rate;
    const inverseRate = 1 / rate;

    output.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}
(1 ${toCurr.value} = ${inverseRate.toFixed(2)} ${fromCurr.value})`;
  } catch (error) {
    output.innerText = "Error fetching exchange rate. Try again later.";
    console.error("API fetch error:", error);
  }
};

// Click to get rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load default rate
window.addEventListener("load", () => {
  updateExchangeRate();
});
