const projects = [
  "Animated Landing Page",
  "Advanced To-Do List",
  "Weather Forecast App",
  "Jewellery-company landing page",
  "Random Image Generator",
  "New Year Countdown",
  "Stylish Animated loginpage",
  "BMI Calculator",
  "QR Generator",
  "Rock Paper Scissors Game",
  "Reading Journal",
  "Pong Game",
  "Colour Picker",
  "Drawing Canvas",
  "Nasa Astronomy Picture of the day",
  "World Clock",
  "Mood Timer",
  "text to PDF Convertor",
  "Memory Card Game",
  "Email Validator",  
  "Snake And Ladder Game",
  "Space Jumper Game",
  "Calculator",
  "Promodoro Timer",
  "Temperature Converter",
  "Space War Game",
  "CHESS GAME",

  "Bubble Shooter Game",
  " ",
  "Guess the Number Game",
  "Typing Speed Test webapp ",
  "Startup Name Generator Web App",
  "",
  " ",
  "Snake Game ",
 "Hangman Game",
  "Simon Say Game ",
  " ",
  " ",
  "Doodle Jump Game",

  "BrainBuzz Quizz Website",
  "",

  " currency Converter",

  " ",
  " ",
  "",
  "Digital Clock",
  "Random Password Generator",
  "Doodle Jump Game",
  "BrainBuzz Quizz Website",
  "Code Editor",
  "Spotify Clone",
  "Study Group Finder"

  // Add more project names as needed

];

const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

const tableBody = document.getElementById("tableBody");
const projectCount = document.getElementById("projectCount");
projectCount.textContent = projects.length;

// --- Random Project Button Functionality ---
const randomBtn = document.getElementById("randomProjectBtn");
let showingRandom = false;
let lastRandomIndex = null;

randomBtn.addEventListener("click", () => {
  const rows = tableBody.getElementsByTagName("tr");

  if (showingRandom) {
    // Restore all rows
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.display = "";
    }
    randomBtn.textContent = " Random";
    showingRandom = false;
    lastRandomIndex = null;
    return;
  }

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * projects.length);
  lastRandomIndex = randomIndex;
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = i === randomIndex ? "" : "none";
  }
  randomBtn.textContent = " Show All";
  showingRandom = true;
});

projects.forEach((name, index) => {
  const day = `Day ${String(index + 1).padStart(2, "0")}`;
  let link;
  
  // Dynamic link generation for specific projects
  if (name === "Nasa Astronomy Picture of the day") {
    link = "https://sabaaa01.github.io/NASA-astronomy-photo-of-the-day/";
  } else if (name === "BrainBuzz Quizz Website") {
    link = "https://brain-buzz-six.vercel.app/";
  } else {
    const folder = `day${String(index + 1).padStart(2, "0")}`;
    link = `public/${folder}/index.html`;
  }

  const row = document.createElement("tr");
  row.classList.add("project-row");

  row.innerHTML = `
    <td class="p-4 font-semibold text-primary">${day}</td>
    <td class="p-4">${name}</td>
    <td class="p-4">
      <a href="${link}" target="_blank" class="text-primary underline hover:text-pink-500">Live Demo</a>
    </td>
  `;

  tableBody.appendChild(row);
});
