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

    // Update active tag button
    document.querySelectorAll('.tag-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tag="${tag}"]`).classList.add('active');
}

// Random project functionality
function goToRandomProject() {
    const projectData = [
        { name: "To-Do List", url: "/public/TO_DO_LIST/todolist.html" },
        { name: "Digital Clock", url: "/public/digital_clock/digitalclock.html" },
        // Add more projects as they are completed
    ];
    
    const availableProjects = projectData.filter(project => project.url && project.url.trim() !== '');
    
    if (availableProjects.length > 0) {
        const randomProject = availableProjects[Math.floor(Math.random() * availableProjects.length)];
        window.open(randomProject.url, '_blank');
    } else {
        alert('No projects available yet! Check back soon.');
    }
}

// Update Navbar for Login Status
const buttons = document.getElementsByClassName('buttons')[0]; // Refers to the section on NavBar where buttons will get appended based on login status

function updateNavbar() {
    const username = localStorage.getItem('username');
    if (username) {
        buttons.innerHTML = `
        <button class="button is-success is-dark has-text-weight-bold">
            Welcome ${username}
        </button>
        <button class="button is-danger is-dark" id='logout'>
            Logout
        </button>
        <a class="button is-primary is-dark" href="https://github.com/ruchikakengal">
            <strong>GitHub</strong>  
        </a>
        <a class="button is-primary is-dark" href="contributors/contributor.html">
            <strong>Contributors</strong>
        </a>`;

        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('username');
            updateNavbar();
        });
    } else {
        buttons.innerHTML = `
        <a class="button is-primary is-dark" href="contributors/contributor.html">
            <strong>Contributors</strong>
        </a>
        <a class="button is-primary is-dark" href="https://github.com/ruchikakengal">
            <strong>GitHub</strong>
        </a>
        <a class="button is-success is-light" href="/public/Login.html">
            <strong>Log in</strong>
        </a>`;
    }
}

// Enhanced project data with tags
function fillTable() {
    const projectData = [
        {
            day: "Day 1",
            name: "To-Do List",
            url: "/public/TO_DO_LIST/todolist.html",
            tags: ["tool", "ui"]
        },
        {
            day: "Day 2",
            name: "Digital Clock",
            url: "/public/digital_clock/digitalclock.html",
            tags: ["clock", "ui"]
        },
        {
            day: "Day 3",
            name: "Calculator",
            url: "",
            tags: ["tool", "ui"]
        },
        {
            day: "Day 4",
            name: "Weather App",
            url: "",
            tags: ["api", "ui"]
        },
        {
            day: "Day 5",
            name: "Memory Game",
            url: "",
            tags: ["game", "ui"]
        },
    ];

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear existing content

    projectData.forEach(project => {
        const row = document.createElement('tr');
        row.classList.add('project-row');
        row.setAttribute('data-tags', project.tags.join(' '));

        // Day column
        const dayCell = document.createElement('td');
        dayCell.classList.add('p-4', 'font-semibold');
        dayCell.innerText = project.day;

        // Project name column
        const nameCell = document.createElement('td');
        nameCell.classList.add('p-4', 'project-name');
        nameCell.innerText = project.name;

        // Tags column
        const tagsCell = document.createElement('td');
        tagsCell.classList.add('p-4');
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('flex', 'gap-1', 'flex-wrap');
        
        project.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.classList.add('bg-primary', 'text-white', 'px-2', 'py-1', 'rounded-full', 'text-xs');
            tagSpan.innerText = tag;
            tagsContainer.appendChild(tagSpan);
        });
        tagsCell.appendChild(tagsContainer);

        // Demo link column
        const linkCell = document.createElement('td');
        linkCell.classList.add('p-4');
        
        if (project.url && project.url.trim() !== '') {
            const link = document.createElement('a');
            link.href = project.url;
            link.innerText = '🚀 Demo';
            link.target = '_blank';
            link.classList.add('bg-primary', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'btn-3d', 'inline-block', 'hover:bg-pink-600', 'transition-colors');
            linkCell.appendChild(link);
        } else {
            const comingSoon = document.createElement('span');
            comingSoon.innerText = '🚧 Coming Soon';
            comingSoon.classList.add('text-gray-500', 'italic');
            linkCell.appendChild(comingSoon);
        }

        row.appendChild(dayCell);
        row.appendChild(nameCell);
        row.appendChild(tagsCell);
        row.appendChild(linkCell);

        tbody.appendChild(row);
    });

    // Update project count in about section
    const completedProjects = projectData.filter(p => p.url && p.url.trim() !== '').length;
    const projectCountElement = document.getElementById('projectCount');
    if (projectCountElement) {
        projectCountElement.innerText = completedProjects;
    }
}

// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or default to dark
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        // Try to respect system preference
        savedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('theme', newTheme);
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}


// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fillTable();
    initializeTheme();
    
    // Set up live search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', liveSearch);
    
    // Set up tag filters
    document.querySelectorAll('.tag-filter').forEach(button => {
        button.addEventListener('click', (e) => {
            const tag = e.target.getAttribute('data-tag');
            filterByTag(tag);
            
            // Clear search input when filtering by tag
            searchInput.value = '';
        });
    });
    
    // Set default active tag
    document.querySelector('[data-tag="all"]').classList.add('active');
    
    // Set up random project button
    const randomBtn = document.getElementById('randomProjectBtn');
    randomBtn.addEventListener('click', goToRandomProject);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhanced scroll functionality
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollBtn');
    if (window.pageYOffset > 100) {
        scrollBtn.classList.remove('hidden');
    } else {
        scrollBtn.classList.add('hidden');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
