const { jsPDF } = window.jspdf;

const generateBtn = document.getElementById("generate-btn");
const clearBtn = document.getElementById("clear-btn");
const textInput = document.getElementById("text-input");

generateBtn.addEventListener("click", async () => {
  const inputText = textInput.value.trim();

  if (!inputText) {
    alert("⚠️ Please enter some text!");
    return;
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 10;
  const pageHeight = doc.internal.pageSize.height;
  const textLines = doc.splitTextToSize(inputText, 180);
  let y = margin;

  for (let i = 0; i < textLines.length; i++) {
    if (y + 10 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(textLines[i], margin, y);
    y += 10;
  }

  doc.save("galactic-pdf.pdf");
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
});

