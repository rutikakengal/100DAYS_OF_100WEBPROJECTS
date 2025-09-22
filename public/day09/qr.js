const input = document.getElementById("qr-input");
const button = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");
const qrCanvas = document.getElementById("qr-canvas");

const sizeSlider = document.getElementById("qr-size");
const sizeLabel = document.getElementById("size-label");
const marginSlider = document.getElementById("qr-margin");
const marginLabel = document.getElementById("margin-label");
const fgColor = document.getElementById("color-foreground");
const bgColor = document.getElementById("color-background");

sizeSlider.addEventListener("input", () => {
  sizeLabel.textContent = sizeSlider.value;
});
marginSlider.addEventListener("input", () => {
  marginLabel.textContent = marginSlider.value;
});

let qr = new QRious({
  element: qrCanvas,
  value: "",
  size: parseInt(sizeSlider.value),
  background: bgColor.value,
  foreground: fgColor.value,
  level: "M",
  padding: parseInt(marginSlider.value),
});

button.addEventListener("click", () => {
  if (!input.value.trim()) {
    alert("⚠️ Please enter text or URL!");
    return;
  }
  qr.set({
    value: input.value,
    size: parseInt(sizeSlider.value),
    background: bgColor.value,
    foreground: fgColor.value,
    padding: parseInt(marginSlider.value),
  });
});

// Download QR as PNG
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = qrCanvas.toDataURL("image/png");
  link.click();
});

