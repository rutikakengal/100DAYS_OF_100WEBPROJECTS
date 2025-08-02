
// Mobile Navigation Toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  });
}
if (close) {
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  });
}

// Hero Section Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    new TypeIt("#typing-animation", {
      strings: ["Design Redefined.", "Future-Forward Fashion.", "Discover the Aurora Collection."],
      speed: 100,
      breakLines: false,
      waitUntilVisible: true,
      loop: true,
      lifeLike: true,
      cursorChar: '▋'
    }).go();
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Optional: Stop observing after revealing to save resources
      // observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1 // Triggers when 10% of the element is visible
});
revealElements.forEach(el => {
  revealObserver.observe(el);
});