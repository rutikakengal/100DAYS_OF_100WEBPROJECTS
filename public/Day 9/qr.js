const input = document.getElementById("qr-input");
const button = document.getElementById("generate-btn");
const qrImg = document.getElementById("qr-img");

button.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return alert("Please enter text or URL!");

  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}`;
  qrImg.style.display = "block";
});

