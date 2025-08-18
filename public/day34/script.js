window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".glass-navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});
const slides = document.querySelector(".slides");
const images = document.querySelectorAll(".slides img");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;
const totalImages = images.length;

function updateSlider() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevBtn.addEventListener("click", () => {
  currentIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
  updateSlider();
});

nextBtn.addEventListener("click", () => {
  currentIndex = currentIndex === totalImages - 1 ? 0 : currentIndex + 1;
  updateSlider();
});

function openTripDetails() {
  document.getElementById("trip-modal").style.display = "block";
}

function closeTripDetails() {
  document.getElementById("trip-modal").style.display = "none";
}

// Wayanad
function openWayanadDetails() {
  document.getElementById("wayanad-modal").style.display = "block";
}

function closeWayanadDetails() {
  document.getElementById("wayanad-modal").style.display = "none";
}
// periyar
function openPeriyarDetails() {
  document.getElementById("periyar-modal").style.display = "block";
}

function closePeriyarDetails() {
  document.getElementById("periyar-modal").style.display = "none";
}

function openAgastyarDetails() {
  document.getElementById("agastyar-modal").style.display = "block";
}

function closeAgastyarDetails() {
  document.getElementById("agastyar-modal").style.display = "none";
}

// Close modals when clicking outside
window.onclick = function (event) {
  const munnar = document.getElementById("trip-modal");
  const wayanad = document.getElementById("wayanad-modal");
  if (event.target == munnar) {
    munnar.style.display = "none";
  }
  if (event.target == wayanad) {
    wayanad.style.display = "none";
  }
};
// ladakh.html
// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".glass-navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// Modal control functions
function openChadarDetails() {
  document.getElementById("chadar-modal").style.display = "block";
}
function closeChadarDetails() {
  document.getElementById("chadar-modal").style.display = "none";
}

function openMarkhaDetails() {
  document.getElementById("markha-modal").style.display = "block";
}
function closeMarkhaDetails() {
  document.getElementById("markha-modal").style.display = "none";
}

function openNubraDetails() {
  document.getElementById("nubra-modal").style.display = "block";
}
function closeNubraDetails() {
  document.getElementById("nubra-modal").style.display = "none";
}

// Close modals when clicking outside
window.onclick = function (event) {
  const modals = ["chadar-modal", "markha-modal", "nubra-modal"];
  modals.forEach((id) => {
    const modal = document.getElementById(id);
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
//uttrakhand.html

// Kerala Modals
function openTripDetails() {
  document.getElementById("trip-modal").style.display = "block";
}
function closeTripDetails() {
  document.getElementById("trip-modal").style.display = "none";
}

function openWayanadDetails() {
  document.getElementById("wayanad-modal").style.display = "block";
}
function closeWayanadDetails() {
  document.getElementById("wayanad-modal").style.display = "none";
}

function openPeriyarDetails() {
  document.getElementById("periyar-modal").style.display = "block";
}
function closePeriyarDetails() {
  document.getElementById("periyar-modal").style.display = "none";
}

function openAgastyarDetails() {
  document.getElementById("agastyar-modal").style.display = "block";
}
function closeAgastyarDetails() {
  document.getElementById("agastyar-modal").style.display = "none";
}

// Uttarakhand Modals
function openVoFDetails() {
  document.getElementById("vof-modal").style.display = "block";
}
function closeVoFDetails() {
  document.getElementById("vof-modal").style.display = "none";
}

function openKedarDetails() {
  document.getElementById("kedar-modal").style.display = "block";
}
function closeKedarDetails() {
  document.getElementById("kedar-modal").style.display = "none";
}

function openRoopkundDetails() {
  document.getElementById("roopkund-modal").style.display = "block";
}
function closeRoopkundDetails() {
  document.getElementById("roopkund-modal").style.display = "none";
}

function openNandaDetails() {
  document.getElementById("nanda-modal").style.display = "block";
}
function closeNandaDetails() {
  document.getElementById("nanda-modal").style.display = "none";
}

// Close modal on outside click
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
// sikkim.html
// Modal JavaScript
function openDzongri() {
  document.getElementById("dzongri-modal").style.display = "block";
}
function closeDzongri() {
  document.getElementById("dzongri-modal").style.display = "none";
}

function openGoechala() {
  document.getElementById("goechala-modal").style.display = "block";
}
function closeGoechala() {
  document.getElementById("goechala-modal").style.display = "none";
}

function openGreenLake() {
  document.getElementById("greenlake-modal").style.display = "block";
}
function closeGreenLake() {
  document.getElementById("greenlake-modal").style.display = "none";
}

function openBarsey() {
  document.getElementById("barsey-modal").style.display = "block";
}
function closeBarsey() {
  document.getElementById("barsey-modal").style.display = "none";
}

window.onclick = function (event) {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (event.target == modal) modal.style.display = "none";
  });
};
// meghalaya.html
function openRoot() {
  document.getElementById("root-modal").style.display = "block";
}
function closeRoot() {
  document.getElementById("root-modal").style.display = "none";
}

function openDawki() {
  document.getElementById("dawki-modal").style.display = "block";
}
function closeDawki() {
  document.getElementById("dawki-modal").style.display = "none";
}

function openSiju() {
  document.getElementById("siju-modal").style.display = "block";
}
function closeSiju() {
  document.getElementById("siju-modal").style.display = "none";
}

function openLaitlum() {
  document.getElementById("laitlum-modal").style.display = "block";
}
function closeLaitlum() {
  document.getElementById("laitlum-modal").style.display = "none";
}

window.onclick = function (event) {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (event.target == modal) modal.style.display = "none";
  });
};
//himachal pradesh
function openTriund() {
  document.getElementById("triund-modal").style.display = "block";
}
function closeTriund() {
  document.getElementById("triund-modal").style.display = "none";
}

function openSpiti() {
  document.getElementById("spiti-modal").style.display = "block";
}
function closeSpiti() {
  document.getElementById("spiti-modal").style.display = "none";
}

function openBir() {
  document.getElementById("bir-modal").style.display = "block";
}
function closeBir() {
  document.getElementById("bir-modal").style.display = "none";
}

function openHampta() {
  document.getElementById("hampta-modal").style.display = "block";
}
function closeHampta() {
  document.getElementById("hampta-modal").style.display = "none";
}

window.onclick = function (event) {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (event.target === modal) modal.style.display = "none";
  });
};

const words = ["Mountains", "Forests", "Rivers", "Trails", "Peaks"];
let wordIndex = 0;
let charIndex = 0;
const typingSpeed = 200;
const erasingSpeed = 200;
const delayBetweenWords = 2000; // Delay before typing next word
const changingWord = document.getElementById("changingword");

function typeWord() {
  if (charIndex < words[wordIndex].length) {
    changingWord.textContent += words[wordIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWord, typingSpeed);
  } else {
    setTimeout(eraseWord, delayBetweenWords);
  }
}

function eraseWord() {
  if (charIndex > 0) {
    changingWord.textContent = words[wordIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseWord, erasingSpeed);
  } else {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeWord, typingSpeed);
  }
}

// Start the typing effect on page load
document.addEventListener("DOMContentLoaded", () => {
  if (words.length) typeWord();
});
