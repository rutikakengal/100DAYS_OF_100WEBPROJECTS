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
  "Animated Login Form",
  "Guess the Number Game",
  "Typing Speed Test webapp ",
  "Startup Name Generator Web App",
  "",
  "Recipe Finder",
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
  "GiggleBits",
  "",
  "Digital Clock",
  "Random Password Generator",
  "Doodle Jump Game",
  "BrainBuzz Quizz Website",
  "Code Editor",

  "Spotify Clone",
  "Plant Care Scheduler",

  "Mood Quote Poster",
  "Echo Chamber",

  
  

  "Typing Survival Game",
  "Amazon Clone (Web-Page)",
  "Adventure Flappy Bird",
   "Expense Tracker",


  // Add more project names as needed

];
// Frontend projects data
const frontendProjects = [
  {
    name: "Expense Tracker",
    technology: "HTML, CSS & JavaScript",
    folder: "Day59",
    description: "Personal finance management app with categories, charts, and data persistence"
  },
  // Add more frontend projects here as they are created
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
   // Add data attributes for filtering
  row.setAttribute('data-name', name.toLowerCase());
  row.setAttribute('data-day', day);

  row.innerHTML = `
    <td class="p-4 font-semibold text-primary">${day}</td>
    <td class="p-4">${name}</td>
    <td class="p-4">
      <a href="${link}" target="_blank" class="text-primary underline hover:text-pink-500">Live Demo</a>
    </td>
  `;

  tableBody.appendChild(row);
});
// Tag filtering functionality
const tagFilters = document.querySelectorAll('.tag-filter');
let currentFilter = 'all';

tagFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    // Remove active class from all filters
    tagFilters.forEach(f => f.classList.remove('active'));
    // Add active class to clicked filter
    filter.classList.add('active');
    
    const tag = filter.getAttribute('data-tag');
    currentFilter = tag;
    
    if (tag === 'frontend') {
      showFrontendProjects();
    } else {
      showAllProjects();
      if (tag !== 'all') {
        // Filter by other tags (you can implement other filtering logic here)
        filterByTag(tag);
      }
    }
  });
});

// Set 'All Projects' as default active
document.querySelector('[data-tag="all"]').classList.add('active');

function showFrontendProjects() {
  // Clear existing table content
  tableBody.innerHTML = '';
  
  // Add frontend projects to table
  frontendProjects.forEach((project, index) => {
    const projectNumber = `FE${String(index + 1).padStart(2, "0")}`;
    const link = `public/${project.folder}/index.html`;

    const row = document.createElement("tr");
    row.classList.add("project-row");

    row.innerHTML = `
      <td class="p-4 font-semibold text-primary">${projectNumber}</td>
      <td class="p-4">${project.name}</td>
      <td class="p-4">
        <a href="${link}" target="_blank" class="text-primary underline hover:text-pink-500">Live Demo</a>
      </td>
    `;

    tableBody.appendChild(row);
  });
  
  // Hide "no projects" message
  document.getElementById("no-projects").style.display = "none";
}

function showAllProjects() {
  // Clear existing table content
  tableBody.innerHTML = '';
  
  // Add all regular projects back to table
  projects.forEach((name, index) => {
    if (!name.trim()) return; // Skip empty entries
    
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
    // Add data attributes for filtering
    row.setAttribute('data-name', name.toLowerCase());
    row.setAttribute('data-day', day);

    row.innerHTML = `
      <td class="p-4 font-semibold text-primary">${day}</td>
      <td class="p-4">${name}</td>
      <td class="p-4">
        <a href="${link}" target="_blank" class="text-primary underline hover:text-pink-500">Live Demo</a>
      </td>
    `;

    tableBody.appendChild(row);
  });
  
  // Hide "no projects" message
  document.getElementById("no-projects").style.display = "none";
}

function filterByTag(tag) {
  const rows = tableBody.getElementsByTagName("tr");
  let found = false;
  
  // Simple filtering based on project names (you can make this more sophisticated)
  for (let i = 0; i < rows.length; i++) {
    const projectName = rows[i].getAttribute('data-name') || '';
    let shouldShow = false;
    
    switch(tag) {
      case 'game':
        shouldShow = projectName.includes('game') || projectName.includes('snake') || projectName.includes('chess') || projectName.includes('jumper') || projectName.includes('shooter') || projectName.includes('hangman') || projectName.includes('simon') || projectName.includes('doodle') || projectName.includes('flappy');
        break;
      case 'ui':
        shouldShow = projectName.includes('login') || projectName.includes('landing') || projectName.includes('ui') || projectName.includes('animated') || projectName.includes('jewellery');
        break;
      case 'api':
        shouldShow = projectName.includes('nasa') || projectName.includes('weather') || projectName.includes('api');
        break;
      case 'clock':
        shouldShow = projectName.includes('clock') || projectName.includes('timer') || projectName.includes('countdown');
        break;
      case 'tool':
        shouldShow = projectName.includes('calculator') || projectName.includes('converter') || projectName.includes('generator') || projectName.includes('editor') || projectName.includes('validator') || projectName.includes('qr');
        break;
      case 'journal':
        shouldShow = projectName.includes('journal') || projectName.includes('reading');
        break;
      default:
        shouldShow = true;
    }
    
    rows[i].style.display = shouldShow ? "" : "none";
    if (shouldShow) found = true;
  }
  
  // Show/hide "no projects" message
  document.getElementById("no-projects").style.display = found ? "none" : "block";
}
