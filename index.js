const projects = [
  "Animated Landing Page",
  "To-Do List",
  "Weather App",
  
  // Add more project names as needed
];

const tableBody = document.getElementById("tableBody");
const projectCount = document.getElementById("projectCount");
projectCount.textContent = projects.length;

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
async function loadContributors() {
  const container = document.getElementById("contributorsList");

  try {
    const response = await fetch("https://api.github.com/repos/rutikakengal/100DAYS_OF_100WEBPROJECTS/contributors");
    const contributors = await response.json();

    contributors.forEach((user) => {
      const card = document.createElement("div");
      card.className = "glass p-4 rounded-lg text-center transition hover:scale-105";

      card.innerHTML = `
        <a href="${user.html_url}" target="_blank">
          <img src="${user.avatar_url}" alt="${user.login}" class="w-20 h-20 mx-auto rounded-full mb-3">
          <h3 class="text-sm font-semibold">${user.login}</h3>
        </a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load contributors.</p>`;
    console.error("Error loading contributors:", error);
  }
}

// Load contributors on page load
window.addEventListener("DOMContentLoaded", loadContributors);
