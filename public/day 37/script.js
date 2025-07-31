const quotes = [
  "Believe you can and you're halfway there.",
  "Success is not final; failure is not fatal.",
  "Begin doing. That's how to get started.",
  "Don't waste it living someone else's life.",
  "You miss 100% of the shots you don't take.",
];

const quoteSelect = document.getElementById("quoteSelect");
const nameInput = document.getElementById("nameInput");
const signatureName = document.getElementById("signatureName");
const signatureQuote = document.getElementById("signatureQuote");
const toggleTheme = document.getElementById("toggleTheme");
const customQuoteBox = document.getElementById("customQuoteBox");
const customQuoteInput = document.getElementById("customQuote");

function populateQuotes() {
  quoteSelect.innerHTML = `<option value="">Choose a quote</option>`;
  const colors = ['#ffc1e3', '#ffd6e0', '#ffe4ec', '#ffccd9', '#ffe1f2'];

  quotes.forEach((quote, i) => {
    const option = document.createElement("option");
    option.value = quote;
    option.textContent = quote;
    option.style.backgroundColor = colors[i % colors.length];
    option.style.color = "#3a3a3a";
    quoteSelect.appendChild(option);
  });
}

populateQuotes();

nameInput.addEventListener("input", updateSignature);
quoteSelect.addEventListener("change", updateSignature);

function updateSignature() {
  const name = nameInput.value.trim();
  const quote = quoteSelect.value;
  signatureName.textContent = name || "";
  signatureQuote.textContent = quote || "";
}

function randomizeQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteSelect.value = random;
  updateSignature();
}

function copySignature() {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter your name first!");

  const quote = quoteSelect.value || "";
  const html = `
<div style="font-family: 'Roboto', sans-serif;">
  <p style="font-family: 'Great Vibes', cursive; font-size: 2rem; color: #e91e63;">${name}</p>
  <p style="font-style: italic; color: #555;">${quote}</p>
</div>`;
  navigator.clipboard.writeText(html)
    .then(() => alert("Signature copied!"))
    .catch(() => alert("Copy failed."));
}

function downloadImage() {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter your name first!");
  const node = document.getElementById("signaturePreview");
  html2canvas(node).then(canvas => {
    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

toggleTheme.addEventListener("change", () => {
  document.body.classList.toggle("dark", toggleTheme.checked);
});

function showCustomQuoteInput() {
  customQuoteBox.style.display = "block";
}

function addCustomQuote() {
  const custom = customQuoteInput.value.trim();
  if (custom) {
    quotes.push(custom);
    populateQuotes();
    quoteSelect.value = custom;
    updateSignature();
    customQuoteInput.value = "";
    customQuoteBox.style.display = "none";
  }
}

function deleteSelectedQuote() {
  const selected = quoteSelect.value;
  if (!selected) return alert("Select a quote to delete.");
  const index = quotes.indexOf(selected);
  if (index === -1) return alert("Built-in quotes can't be deleted.");
  if (confirm(`Delete quote: "${selected}"?`)) {
    quotes.splice(index, 1);
    populateQuotes();
    quoteSelect.value = "";
    updateSignature();
  }
}
