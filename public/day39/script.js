const nameInput = document.getElementById('name');
const bioInput = document.getElementById('bio');
const skillsInput = document.getElementById('skills');
const projectsInput = document.getElementById('projects');
const profileImgInput = document.getElementById('profileImg');
const socialInput = document.getElementById('social');

const previewName = document.getElementById('previewName');
const previewBio = document.getElementById('previewBio');
const previewSkills = document.getElementById('previewSkills');
const previewProjects = document.getElementById('previewProjects');
const previewImg = document.getElementById('previewImg');
const previewSocial = document.getElementById('previewSocial');

const themeSelector = document.getElementById('themeSelector');

// Update preview dynamically
nameInput.addEventListener('input', () => previewName.textContent = nameInput.value);
bioInput.addEventListener('input', () => previewBio.textContent = bioInput.value);
skillsInput.addEventListener('input', () => {
  previewSkills.innerHTML = '';
  skillsInput.value.split(',').forEach(skill => {
    if (skill.trim()) {
      const li = document.createElement('li');
      li.textContent = skill.trim();
      previewSkills.appendChild(li);
    }
  });
});
projectsInput.addEventListener('input', () => {
  previewProjects.innerHTML = '';
  projectsInput.value.split(',').forEach(project => {
    if (project.trim()) {
      const li = document.createElement('li');
      li.textContent = project.trim();
      previewProjects.appendChild(li);
    }
  });
});
profileImgInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => previewImg.src = e.target.result;
    reader.readAsDataURL(file);
  }
});
socialInput.addEventListener('input', () => {
  previewSocial.innerHTML = '';
  if (socialInput.value) {
    const a = document.createElement('a');
    a.href = socialInput.value;
    a.innerHTML = `<img src="assets/github.jpg" width="20"> Visit Profile`;
    a.target = '_blank';
    previewSocial.appendChild(a);
  }
});

function savePortfolio() {
  const data = {
    name: nameInput.value,
    bio: bioInput.value,
    skills: skillsInput.value,
    projects: projectsInput.value,
    social: socialInput.value,
    img: previewImg.src
  };
  localStorage.setItem('portfolioData', JSON.stringify(data));
  alert('✅ Portfolio saved locally!');
}

function loadPortfolio() {
  const savedData = localStorage.getItem('portfolioData');
  if (savedData) {
    const data = JSON.parse(savedData);
    nameInput.value = data.name;
    bioInput.value = data.bio;
    skillsInput.value = data.skills;
    projectsInput.value = data.projects;
    socialInput.value = data.social;
    previewImg.src = data.img;

    previewName.textContent = data.name;
    previewBio.textContent = data.bio;
    skillsInput.dispatchEvent(new Event('input'));
    projectsInput.dispatchEvent(new Event('input'));
    socialInput.dispatchEvent(new Event('input'));
  }
}

function clearPortfolio() {
  localStorage.removeItem('portfolioData');
  location.reload();
}

function exportPortfolio() {
  const htmlContent = document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'portfolio.html';
  link.click();
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function changeTheme() {
  let theme = themeSelector.value;
  let existingLink = document.getElementById('themeStylesheet');

  if (theme === 'default') {
    if (existingLink) existingLink.remove();
    return;
  }

  if (!existingLink) {
    existingLink = document.createElement('link');
    existingLink.id = 'themeStylesheet';
    existingLink.rel = 'stylesheet';
    document.head.appendChild(existingLink);
  }
  existingLink.href = theme;
}

window.onload = loadPortfolio;