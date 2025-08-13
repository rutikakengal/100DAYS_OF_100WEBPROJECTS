var current = 1;

var step1 = document.getElementById("step1");
var step2 = document.getElementById("step2");
var step3 = document.getElementById("step3");
var step4 = document.getElementById("step4");
var step5 = document.getElementById("step5");

var prevBtn = document.getElementById("prev");
var nextBtn = document.getElementById("next");

function updateSteps() {
  step1.classList.remove("active");
  step2.classList.remove("active");
  step3.classList.remove("active");
  step4.classList.remove("active");
  step5.classList.remove("active");

  if (current >= 1) step1.classList.add("active");
  if (current >= 2) step2.classList.add("active");
  if (current >= 3) step3.classList.add("active");
  if (current >= 4) step4.classList.add("active");
  if (current >= 5) step5.classList.add("active");

  prevBtn.disabled = current === 1;
  nextBtn.disabled = current === 5;
}

nextBtn.onclick = function () {
  if (current < 5) {
    current = current + 1;
    updateSteps();
  }
};

prevBtn.onclick = function () {
  if (current > 1) {
    current = current - 1;
    updateSteps();
  }
};