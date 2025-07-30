// Resume Studio - Resume Builder
// Live preview, PDF download, local storage

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('resume-form');
  const preview = document.getElementById('resume-preview');
  const previewBtn = document.getElementById('preview-btn');
  const downloadBtn = document.getElementById('download-btn');

  // Load from localStorage if available
  loadFormData();

  // Live preview on input
  form.addEventListener('input', updatePreview);
  previewBtn.addEventListener('click', updatePreview);
  downloadBtn.addEventListener('click', downloadPDF);

  // Save to localStorage on change
  form.addEventListener('input', saveFormData);

  function getFormData() {
    return {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      education: form.education.value,
      summary: form.summary.value,
      projects: form.projects.value,
      skills: form.skills.value,
      experience: form.experience.value
    };
  }

  function updatePreview() {
    const data = getFormData();
    if (!data.name && !data.email && !data.phone) {
      preview.innerHTML = '<p class="placeholder">Fill the form to see live preview...</p>';
      return;
    }
    preview.innerHTML = `
      <div class="resume-template">
        <h1>${data.name || ''}</h1>
        <p><strong>Email:</strong> ${data.email || ''} | <strong>Phone:</strong> ${data.phone || ''}</p>
        <h2>Summary</h2>
        <p>${data.summary || ''}</p>
        <h2>Education</h2>
        <p>${data.education || ''}</p>
        <h2>Projects</h2>
        <ul>${(data.projects || '').split('\n').map(p => p ? `<li>${p}</li>` : '').join('')}</ul>
        <h2>Skills</h2>
        <p>${(data.skills || '').split(',').map(s => `<span class="skill">${s.trim()}</span>`).join(' ')}</p>
        <h2>Experience</h2>
        <p>${data.experience || ''}</p>
      </div>
    `;
  }

  function downloadPDF() {
    updatePreview();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = getFormData();
    let y = 15;
    doc.setFontSize(18);
    doc.text(data.name || '', 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Email: ${data.email || ''} | Phone: ${data.phone || ''}`, 10, y);
    y += 10;
    doc.setFontSize(14);
    doc.text('Summary', 10, y); y += 8;
    doc.setFontSize(12);
    doc.text(data.summary || '', 10, y); y += 10;
    doc.setFontSize(14);
    doc.text('Education', 10, y); y += 8;
    doc.setFontSize(12);
    doc.text(data.education || '', 10, y); y += 10;
    doc.setFontSize(14);
    doc.text('Projects', 10, y); y += 8;
    doc.setFontSize(12);
    (data.projects || '').split('\n').forEach(p => { if (p) { doc.text(`- ${p}`, 12, y); y += 7; } });
    y += 2;
    doc.setFontSize(14);
    doc.text('Skills', 10, y); y += 8;
    doc.setFontSize(12);
    (data.skills || '').split(',').forEach(s => { if (s.trim()) { doc.text(s.trim(), 12, y); y += 7; } });
    y += 2;
    doc.setFontSize(14);
    doc.text('Experience', 10, y); y += 8;
    doc.setFontSize(12);
    doc.text(data.experience || '', 10, y);
    doc.save('Resume.pdf');
  }

  function saveFormData() {
    localStorage.setItem('resumeForm', JSON.stringify(getFormData()));
  }

  function loadFormData() {
    const saved = localStorage.getItem('resumeForm');
    if (saved) {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        if (form[key]) form[key].value = data[key];
      });
      updatePreview();
    }
  }
});
