// --- Simplified array from main branch ---
const simpleProjects = [
  "Animated Landing Page",
  "To-Do List",
  "Weather App",
  // Add more project names as needed
];

// Convert to detailed projectData
const projectData = simpleProjects.map((name, index) => {
  const folder = `day${String(index + 1).padStart(2, "0")}`;
  return {
    day: `Day ${String(index + 1).padStart(2, "0")}`,
    name,
    url: `public/${folder}/index.html`,
    tags: ["ui"] // You can adjust tags per project later
  };
});

// Live search functionality
function liveSearch() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const rows = document.querySelector('tbody').querySelectorAll('tr');
  let hasResults = false;

  rows.forEach(row => {
    const projectName = row.querySelector('.project-name')?.innerText.toLowerCase() || '';
    const tags = row.getAttribute('data-tags')?.toLowerCase() || '';

    if (projectName.includes(filter) || tags.includes(filter)) {
      row.style.display = '';
      hasResults = true;
    } else {
      row.style.display = 'none';
    }
  });

  const noProjectsMessage = document.getElementById('no-projects');
  noProjectsMessage.style.display = hasResults ? 'none' : 'block';
}

// Tag filtering functionality
function filterByTag(tag) {
  const rows = document.querySelector('tbody').querySelectorAll('tr');
  let hasResults = false;

  rows.forEach(row => {
    const rowTags = row.getAttribute('data-tags') || '';

    if (tag === 'all' || rowTags.includes(tag)) {
      row.style.display = '';
      hasResults = true;
    } else {
      row.style.display = 'none';
    }
  });

  const noProjectsMessage = document.getElementById('no-projects');
  noProjectsMessage.style.display = hasResults ? 'none' : 'block';

  document.querySelectorAll('.tag-filter').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tag="${tag}"]`).classList.add('active');
}

// Random project
function goToRandomProject() {
  const availableProjects = projectData.filter(p => p.url && p.url.trim() !== '');
  if (availableProjects.length > 0) {
    const randomProject = availableProjects[Math.floor(Math.random() * availableProjects.length)];
    window.open(randomProject.url, '_blank');
  } else {
    alert('No projects available yet! Check back soon.');
  }
}

// Update Navbar
function updateNavbar() {
  const buttons = document.getElementsByClassName('buttons')[0];
  const username = localStorage.getItem('username');

  if (username) {
    buttons.innerHTML = `
      <button class="button is-success is-dark has-text-weight-bold">Welcome ${username}</button>
      <button class="button is-danger is-dark" id='logout'>Logout</button>
      <a class="button is-primary is-dark" href="https://github.com/ruchikakengal"><strong>GitHub</strong></a>
      <a class="button is-primary is-dark" href="contributors/contributor.html"><strong>Contributors</strong></a>
    `;
    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('username');
      updateNavbar();
    });
  } else {
    buttons.innerHTML = `
      <a class="button is-primary is-dark" href="contributors/contributor.html"><strong>Contributors</strong></a>
      <a class="button is-primary is-dark" href="https://github.com/ruchikakengal"><strong>GitHub</strong></a>
      <a class="button is-success is-light" href="/public/Login.html"><strong>Log in</strong></a>
    `;
  }
}

// Fill table with rich project data
function fillTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  projectData.forEach(project => {
    const row = document.createElement('tr');
    row.classList.add('project-row');
    row.setAttribute('data-tags', project.tags.join(' '));

    row.innerHTML = `
      <td class="p-4 font-semibold">${project.day}</td>
      <td class="p-4 project-name">${project.name}</td>
      <td class="p-4">
        <div class="flex flex-wrap gap-1">
          ${project.tags.map(tag => `<span class="bg-primary text-white px-2 py-1 rounded-full text-xs">${tag}</span>`).join('')}
        </div>
      </td>
      <td class="p-4">
        ${
          project.url && project.url.trim() !== ''
            ? `<a href="${project.url}" target="_blank" class="bg-primary text-white px-4 py-2 rounded-lg btn-3d inline-block hover:bg-pink-600 transition-colors">🚀 Demo</a>`
            : `<span class="text-gray-500 italic">🚧 Coming Soon</span>`
        }
      </td>
    `;

    tbody.appendChild(row);
  });

  // Update project count
  const completed = projectData.filter(p => p.url && p.url.trim() !== '').length;
  const projectCount = document.getElementById('projectCount');
  if (projectCount) projectCount.innerText = completed;
}

// Theme switcher
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  let savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  body.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', newTheme);
    body.style.transition = 'all 0.3s ease';
    setTimeout(() => (body.style.transition = ''), 300);
  });
}

// Contributors
async function loadContributors() {
  const section = document.getElementById("contributorsList");
  if (!section) return;
  try {
    const res = await fetch("https://api.github.com/repos/rutikakengal/100DAYS_OF_100WEBPROJECTS/contributors");
    const contributors = await res.json();
    contributors.forEach(c => {
      const card = document.createElement("div");
      card.className = "flex flex-col items-center p-4 bg-gray-100 text-black rounded-xl shadow-md hover:shadow-lg transition-all";
      card.innerHTML = `
        <img src="${c.avatar_url}" alt="${c.login}" class="w-16 h-16 rounded-full mb-2" />
        <a href="${c.html_url}" target="_blank" class="text-sm font-semibold text-blue-600 hover:underline">${c.login}</a>
        <span class="text-xs text-gray-600">${c.contributions} contributions</span>
      `;
      section.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load contributors:", err);
  }
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  fillTable();
  initializeTheme();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', liveSearch);

  document.querySelectorAll('.tag-filter').forEach(button =>
    button.addEventListener('click', e => {
      filterByTag(e.target.getAttribute('data-tag'));
      searchInput.value = '';
    })
  );

  const randomBtn = document.getElementById('randomProjectBtn');
  if (randomBtn) randomBtn.addEventListener('click', goToRandomProject);

  const contributorsSection = document.getElementById("contributorsList");
  if (contributorsSection) loadContributors();

  document.querySelectorAll('a[href^="#"]').forEach(anchor =>
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );

  document.querySelector('[data-tag="all"]')?.classList.add('active');
});
