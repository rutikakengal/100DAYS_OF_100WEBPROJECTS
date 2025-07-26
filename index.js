const projects = [
  "Animated Landing Page",
  "To-Do List",
  "Weather App",
  "Jewellery-company landing page",
  "Random Image Generator",
  "New Year Countdown",
  "Stylish Animated loginpage",
  "BMI Calculator",
   "QR Generator",
  "Rock Paper Scissors Game",
  "Reading Journal",
  "Dictionary App"

  // Add more project names as needed
];

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
  if (name === "QR Generator") {
  link = `public/Day 9/index.html`;
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
