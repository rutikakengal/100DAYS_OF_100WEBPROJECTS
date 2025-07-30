const gallery = document.getElementById("dogGallery");
const breedFilter = document.getElementById("breedFilter");
let dogImages = [];

async function loadDogs() {
  gallery.innerHTML = "Loading...";
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random/10");
    const data = await res.json();
    dogImages = data.message;
    showDogs(dogImages);
  } catch (err) {
    gallery.innerHTML = "Failed to load dogs.";
    console.error(err);
  }
}

function showDogs(images) {
  gallery.innerHTML = "";
  images.forEach(img => {
    const breed = img.split("/")[4]; 
    const imgElem = document.createElement("img");
    imgElem.src = img;
    imgElem.alt = breed;
    imgElem.title = breed;
    gallery.appendChild(imgElem);
  });
}

// Filter based on breed name
breedFilter.addEventListener("input", () => {
  const search = breedFilter.value.toLowerCase();
  const filtered = dogImages.filter(img =>
    img.split("/")[4].toLowerCase().includes(search)
  );
  showDogs(filtered);
});

window.onload = loadDogs;

