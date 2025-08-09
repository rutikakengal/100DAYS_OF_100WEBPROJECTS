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
    filterCards();
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


//  =============== Light mode and Dark Mode toggle ===============
const toggleBtn = document.getElementById("theme-toggle");
const favicon = document.getElementById("favicon");

const lightModeCSS =
  `
section {
  background-color: white;
}

.wsmainfull, .wsmobileheader {
  background-color: white !important;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  
}

.wsmainfull ul li a, h1, h2, footer h5, .paraText, .card p, .card a, .statsBox p, footer hr, footer p, footer ul li a   {
color: black !important;
}

#heroSection, #aboutChallegeSection {
    background-color: #f8fafc !important;
}

#aboutChallegeSection p, #contributionStatsSection p {
  color: black !Important;


#heroSection, #aboutChallegeSection {
    background-color: #f8fafc !important;
}



.card {
    background: #f8fafc !important;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;
}

.card:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px !important;
}

footer {
  background-color: #f8fafc !important;
}

`
  ;

let styleTag;

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.innerHTML = lightModeCSS;
      document.head.appendChild(styleTag);
    }
    toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    favicon.href = "sun.png";
  } else {
    if (styleTag) {
      styleTag.remove();
      styleTag = null;
    }
    toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    favicon.href = "moon.png";
  }
});
