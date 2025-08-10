const imageInput = document.getElementById('imageInput');
const uploadForm = document.getElementById('uploadForm');
const generateBtn = document.getElementById('generateBtn');
const captionText = document.getElementById('captionText');
const uploadMessage = document.getElementById('uploadMessage');
const imagePreview = document.getElementById('imagePreview');
const captionOutput = document.getElementById('captionOutput');
const resultContainer = document.getElementById('resultContainer');
const copyCaptionBtn = document.getElementById('copyCaptionBtn');


let uploadedFile = null;

// Drag & drop handlers
uploadForm.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadForm.classList.add('dragover');
});

uploadForm.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadForm.classList.remove('dragover');
});

uploadForm.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadForm.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    if (!e.dataTransfer.files[0].type.startsWith('image/')) {
      alert('Please drop a valid image file.');
      return;
    }
    uploadedFile = e.dataTransfer.files[0];
    imageInput.files = e.dataTransfer.files; // update hidden input for form
    generateBtn.disabled = false;

    uploadMessage.textContent = `"${uploadedFile.name} uploaded."`;
    displayImage(uploadedFile);
    captionOutput.textContent = '';
    resultContainer.style.display =  'flex';
    copyCaptionBtn.style.display = 'none';
  }
});

// Manual file select
imageInput.addEventListener('change', () => {
  if (imageInput.files && imageInput.files[0]) {
    uploadedFile = imageInput.files[0];
    generateBtn.disabled = false;

    uploadMessage.textContent = `"${uploadedFile.name}" uploaded.`;
    displayImage(uploadedFile);
    captionOutput.textContent = '';
    resultContainer.style.display = 'flex';
    copyCaptionBtn.style.display = 'none';
  } else {
    clearPreview();
    generateBtn.disabled = true;
    resultContainer.style.display = 'none';
  }
});

function displayImage(file) {
  const reader = new FileReader();
  reader.onload = e => {
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function clearPreview() {
  imagePreview.src = '';
  imagePreview.style.display = 'none';
  uploadMessage.textContent = '';
  captionOutput.textContent = '';
}

async function generateCaption() {
  if (!uploadedFile) {
    alert('Please upload an image first.');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const formData = new FormData();
    formData.append('image', uploadedFile)

    const response = await fetch('http://127.0.0.1:5000/caption', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if(response.ok) {
      captionOutput.textContent = data.caption;
      copyCaptionBtn.style.display = 'inline-block';
    } else {
      alert('Error: ' + (data.errordata.error || 'Failed to generate caption'));
      copyCaptionBtn.style.display = 'none';
    }
  } catch (error) {
    alert('Error: ' + error.message);
      copyCaptionBtn.style.display = 'none';
  }

  generateBtn.disabled = false;
  generateBtn.textContent = 'Generate Caption';
}

generateBtn.addEventListener('click', generateCaption);


imageInput.addEventListener('change', () => {
  if(imageInput.files && imageInput.files[0]) {
    uploadedFile = imageInput.files[0];
    generateBtn.disabled = false;

    uploadMessage.textContent = `"${uploadedFile.name}" uploaded.`;
    displayImage(uploadedFile);
    captionOutput.textContent = '';
  } else {
    clearPreview();
    generateBtn.disabled = true;
  }
});

copyCaptionBtn.addEventListener('click', () => {
  if(captionOutput.textContent.trim() !== '') {
    navigator.clipboard.writeText(captionOutput.textContent);
    alert('Caption copied to clipboard');
  }
})