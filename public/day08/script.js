const quotes = [
  "The best way to get started is to quit talking and begin doing. – Walt Disney",
  "Don't let yesterday take up too much of today. – Will Rogers",
  "Success is not in what you have, but who you are. – Bo Bennett",
  "It's not whether you get knocked down, it's whether you get up. – Vince Lombardi",
  "Creativity is intelligence having fun. – Albert Einstein",
  "Do what you can with all you have, wherever you are. – Theodore Roosevelt",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "Believe you can and you're halfway there. – Theodore Roosevelt"
];

function generateQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const periodIndex = quote.indexOf('.') !== -1 ? quote.indexOf('.') : quote.length;
  const beforePeriod = quote.slice(0, periodIndex + 1);
  const afterPeriod = quote.slice(periodIndex + 1);
  document.getElementById('quote').innerText = '“' + beforePeriod + '”' + afterPeriod;
}

// Show a quote on page load
window.onload = generateQuote;