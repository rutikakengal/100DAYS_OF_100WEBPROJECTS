const slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  gsap.to(slides[current], {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      slides[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      gsap.fromTo(slides[current], {opacity: 0}, {opacity: 1, duration: 1});
    }
  });
}

slides[current].classList.add("active");
gsap.to(slides[current], {opacity: 1, duration: 1});

document.getElementById("main").addEventListener("click", () => {
  const next = (current + 1) % slides.length;
  showSlide(next);
});
