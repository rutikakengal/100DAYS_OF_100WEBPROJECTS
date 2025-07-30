document.getElementById("calculateBtn").addEventListener("click", () => {
  const day = parseInt(document.getElementById("day").value);
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  const resultBox = document.getElementById("result");

  // Basic input validation
  if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
    resultBox.style.display = "block";
    resultBox.textContent = "Please enter a valid date of birth.";
    return;
  }

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  if (birthDate > today) {
    resultBox.style.display = "block";
    resultBox.textContent = "Birthdate cannot be in the future.";
    return;
  }

  let years = today.getFullYear() - year;
  let months = today.getMonth() - (month - 1);
  let days = today.getDate() - day;

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  resultBox.style.display = "block";
  resultBox.textContent = `You are ${years} years, ${months} months, and ${days} days old. 🎉`;
});
