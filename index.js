const projects = [
  "Animated Landing Page",
  "To-Do List",
  "Weather App",
  "Jewellery-company landing page",
  "Random Image Generator",
  "New Year Countdown",
  "BMI Calculator",
  "Rock Paper Scissors Game",
  "Reading Journal",
  "Music Player"
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
  const folder = `day${String(index + 1).padStart(2, "0")}`;
  const link = `public/${folder}/index.html`;

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

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const songTitle = document.getElementById("song-title");
const cover = document.getElementById("cover");

// Songs list
const songs = [
    { title: "Song 1", src: "songs/inspirational-motivational-music-370778.mp3", cover: "Images/motivation image.jpg" },
    { title: "Song 2", src: "songs/playful-kids-happy-background-music-376013.mp3", cover: "Images/Happy image.jpg" },
    { title: "Song 3", src: "songs/aspirational-travel-jolly-accordion-214054.mp3", cover: "Images/ukelele image.jpg" }
];

let currentSong = 0;

// Load song
function loadSong(index) {
    audio.src = songs[index].src;
    songTitle.textContent = songs[index].title;
    cover.src = songs[index].cover;
}
loadSong(currentSong);

// Play & Pause
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
});

function playSong() {
    audio.play().catch(err => console.log("Autoplay blocked:", err));
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// Next Song
nextBtn.addEventListener("click", () => {
    currentSong++;
    if (currentSong >= songs.length) currentSong = 0; // Loop back
    loadSong(currentSong);
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});

// Previous Song
prevBtn.addEventListener("click", () => {
    currentSong--;
    if (currentSong < 0) currentSong = songs.length - 1; // Loop to last
    loadSong(currentSong);
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});

// Update progress bar
audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
});

// Seek (click on progress bar)
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});
