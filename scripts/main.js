// =========== Project Search Functionality ====================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cards = document.querySelectorAll(".projectContainer .card");

function filterCards() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  cards.forEach(function (card) {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    const text = card.querySelector(".card-text").textContent.toLowerCase();
    if (searchTerm === "" || title.includes(searchTerm) || text.includes(searchTerm)) {
      card.parentElement.style.display = "block";
    } else {
      card.parentElement.style.display = "none";
    }
  });
}
  
searchBtn.addEventListener("click", filterCards);

searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    filterCards();
  } else if (searchInput.value.trim() === "") {
    filterCards(); // Auto-reset when cleared
  }
});


// ========== Contribution Stats Dynamic Counting ====================
const counters = document.querySelectorAll('.digit');
let started = false;

const startCount = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    let count = 0;
    const increment = target / 100;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.ceil(count) + '+';
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target + '+';
      }
    };
    updateCount();
  });
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !started) {
      startCount();
      started = true;
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.statsContainer'));


// ========== Click to Top Button Functionality ====================
window.onscroll = function () {
  let btn = document.querySelector(".clicktoTopBtn");
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

document.querySelector(".clicktoTopBtn").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

