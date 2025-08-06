<<<<<<< HEAD
// Array of quotes with their authors
const quotes = [
    {
        text: "Do what you can with all you have, wherever you are.",
        author: "Theodore Roosevelt"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu"
    },
    {
        text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        author: "Zig Ziglar"
    },
    {
        text: "The mind is everything. What you think you become.",
        author: "Buddha"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "Everything you've ever wanted is on the other side of fear.",
        author: "George Addair"
    },
    {
        text: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        author: "Nelson Mandela"
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        text: "In order to succeed, we must first believe that we can.",
        author: "Nikos Kazantzakis"
    },
    {
        text: "A winner is a dreamer who never gives up.",
        author: "Nelson Mandela"
    },
    {
        text: "The power of imagination makes us infinite.",
        author: "John Muir"
    },
    {
        text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
        author: "Roy T. Bennett"
    },
    {
        text: "The only way to achieve the impossible is to believe it is possible.",
        author: "Charles Kingsleigh"
    },
    {
        text: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    },
    {
        text: "The harder you work for something, the greater you'll feel when you achieve it.",
        author: "Sudhashree Acharya"
    },
    {
        text: "Dream big and dare to fail.",
        author: "Norman Vaughan"
    }
];

// Get DOM elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

// Function to get a random quote
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Function to display a quote
function displayQuote() {
    const quote = getRandomQuote();
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `- ${quote.author}`;
    
    // Add a subtle animation effect
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    
    setTimeout(() => {
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
    }, 100);
}

// Function to generate a new quote with animation
function generateNewQuote() {
    // Add button click animation
    newQuoteBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        newQuoteBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Display new quote
    displayQuote();
}

// Event listeners
newQuoteBtn.addEventListener('click', generateNewQuote);

// Generate a quote when the page loads
document.addEventListener('DOMContentLoaded', displayQuote);

// Generate a new quote when the page is refreshed
window.addEventListener('load', displayQuote);

// Add keyboard support (spacebar or Enter key)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        generateNewQuote();
    }
});

// Add smooth transitions for quote changes
quoteText.style.transition = 'opacity 0.3s ease-in-out';
quoteAuthor.style.transition = 'opacity 0.3s ease-in-out'; 
=======
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
>>>>>>> 9fb9245766a139f17fd64b985313a4077833e3d0
