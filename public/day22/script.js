const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const type = document.getElementById("type");
const copyBtn = document.getElementById("copy");
const randomBtn = document.getElementById("random");
const cssCode = document.getElementById("css-code");

function generateGradient() {
    const gradientType = type.value;
    const c1 = color1.value;
    const c2 = color2.value;

    const gradient = `${gradientType}-gradient(to right, ${c1}, ${c2})`;
    document.body.style.background = gradient;
    cssCode.value = `background: ${gradient};`;
}

function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

randomBtn.addEventListener("click", () => {
    color1.value = getRandomColor();
    color2.value = getRandomColor();
    generateGradient();
});

copyBtn.addEventListener("click", () => {
    cssCode.select();
    document.execCommand("copy");
    alert("CSS Copied to Clipboard!");
});

color1.addEventListener("input", generateGradient);
color2.addEventListener("input", generateGradient);
type.addEventListener("change", generateGradient);

generateGradient();
