
const colorInput = document.getElementById('colorInput');
const previewBox = document.getElementById('previewBox');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');

colorInput.addEventListener('input', () => {
  const selectedColor = colorInput.value;
  document.body.style.backgroundColor = selectedColor;
  hexValue.textContent = selectedColor;
  rgbValue.textContent = hexToRgb(selectedColor);
});

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}