import { BrowserMultiFormatReader } from 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.0.10/+esm';

const fileInput = document.getElementById('file-upload');
const decodeBtn = document.getElementById('decode-btn');
const outputBox = document.getElementById('output-box');
const uploadMsg = document.getElementById('upload-msg');

let selectedFile = null;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    uploadMsg.textContent = "Image is uploaded";
  }
});

decodeBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    uploadMsg.textContent = "Please upload file first";
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const imageUrl = event.target.result;

    const img = new Image();
    img.src = imageUrl;

    img.onload = async () => {
      const codeReader = new BrowserMultiFormatReader();
      try {
        const result = await codeReader.decodeFromImageElement(img);
        console.log("Decoded result:", result);

        // Just display whatever it decoded:
        outputBox.textContent = result.text || "No data found";
      } catch (err) {
        console.error(err);
        outputBox.textContent = "Failed to decode image";
      }
    };
  };

  reader.readAsDataURL(selectedFile);
});
