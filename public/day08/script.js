// Core function declarations
function saveToLocalStorage() {};
function rebindGlobals() {};
function initializeSlide(slideEl) {};
function setupHoverEvents(img) {};
function setupClickToEdit(img) {};
function createElement(tag, attrs = {}, children = []) {};
function getCurrentSlide() {};
function allSlides() {};
function showSlide(index) {};
function createNewSlide(index) {};
function addBookHandler() {};

// Image compression utility
function compressImage(file, maxSize = 400, callback) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      callback(compressedDataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Main initialization
document.addEventListener("DOMContentLoaded", () => {
  // Restore from localStorage if available
  const saved = localStorage.getItem("readingJournal");
  if (saved) {
    document.body.innerHTML = saved;
    document.querySelectorAll(".slide").forEach(initializeSlide);
    document.querySelectorAll(".images img").forEach(img => {
      setupHoverEvents(img);
      setupClickToEdit(img);
    });
    rebindGlobals();
    showSlide(0);
    return;
  }

  // UI element references
  const colorButton = document.querySelector(".change-color");
  const colorInput = document.querySelector("#change-color");
  const editHeading = document.querySelector("#edit-heading");
  const inputHeading = document.querySelector("#input-heading");

  // Color picker functionality
  colorButton.addEventListener("click", () => colorInput.click());
  colorInput.addEventListener("input", (e) => {
    const currentSlide = getCurrentSlide();
    currentSlide.style.backgroundColor = e.target.value;
    saveToLocalStorage();
  });

  // Title editing functionality
  editHeading.addEventListener("click", () => {
    inputHeading.style.display = "block";
  });
  inputHeading.addEventListener("input", (e) => {
    const currentSlide = getCurrentSlide();
    const title = currentSlide.querySelector(".title");
    title.innerText = e.target.value;
  });
  inputHeading.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const currentSlide = getCurrentSlide();
      const title = currentSlide.querySelector(".title");
      title.innerText = e.target.value;
      inputHeading.style.display = "none";
      saveToLocalStorage();
    }
  });

  // Helper functions
  function getCurrentSlide() {
    return document.querySelector(".slide:not([style*='display: none'])");
  }

  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    children.forEach(child => {
      if (typeof child === "string") el.appendChild(document.createTextNode(child));
      else el.appendChild(child);
    });
    return el;
  }

  // Hover effects for book cards
  function setupHoverEvents(img) {
    img.addEventListener('mouseenter', () => {
      const currentSlide = getCurrentSlide();
      const className = Array.from(img.classList).find(cls => cls.startsWith('card-'));
      const matchingCard = currentSlide.querySelector(`.card.${className} .info`);
      if (!matchingCard) return;

      const cardNumber = parseInt(className.split('-')[1], 10);
      if ((cardNumber >= 5 && cardNumber <= 9) || (cardNumber >= 14 && cardNumber <= 18)) {
        matchingCard.style.left = '20vw';
      } else {
        matchingCard.style.left = '60vw';
      }
      matchingCard.style.top = '0';
      matchingCard.classList.add('visible');
    });

    img.addEventListener('mouseleave', () => {
      const currentSlide = getCurrentSlide();
      const className = Array.from(img.classList).find(cls => cls.startsWith('card-'));
      const matchingCard = currentSlide.querySelector(`.card.${className} .info`);
      if (matchingCard) {
        matchingCard.classList.remove('visible');
        matchingCard.style.left = '';
        matchingCard.style.top = '';
      }
    });
  }

  // Maintain card numbering consistency
  function updateCardNumbers() {
    const currentSlide = getCurrentSlide();
    const images = currentSlide.querySelectorAll(".images img");
    const cards = currentSlide.querySelectorAll(".cards-container .card");

    images.forEach((img, index) => {
      img.className = img.className.replace(/card-\d+/g, '');
      img.classList.add(`card-${index + 1}`);
    });

    cards.forEach((card, index) => {
      card.className = card.className.replace(/card-\d+/g, 'card');
      card.classList.add(`card-${index + 1}`);
    });

    saveToLocalStorage();
  }

  // Book editing functionality
  function setupClickToEdit(img) {
    img.addEventListener('click', () => {
      const currentSlide = getCurrentSlide();
      const className = Array.from(img.classList).find(cls => cls.startsWith('card-'));
      const card = currentSlide.querySelector(`.card.${className}`);
      const info = card.querySelector('.info');

      if (document.querySelector('.popup-form')) return;

      const popup = createElement("div", { class: "popup-form" });
      const close = createElement("i", { class: "fa-solid fa-xmark close-popup" });
      close.addEventListener("click", () => popup.remove());

      const titleInput = createElement("input", {
        type: "text",
        placeholder: "Book Title",
        value: info.querySelector("h3")?.innerText || ""
      });

      const statusSelect = createElement("select");
      ["Reading", "Completed", "Wishlist", "Dnf"].forEach(status => {
        const opt = createElement("option", { value: status }, [status]);
        if (info.querySelector(".status")?.innerText.includes(status)) opt.selected = true;
        statusSelect.appendChild(opt);
      });

      const ratingInput = createElement("input", {
        type: "number", min: "0", max: "5", step: "0.5",
        value: info.querySelector(".rating")?.innerText?.match(/\d+(\.\d+)?/)?.[0] || ""
      });

      const commentInput = createElement("textarea", { rows: "3", placeholder: "Comment..." }, [
        info.querySelector(".comment")?.innerText?.replace("Comment: ", "") || ""
      ]);

      const imageInput = createElement("input", { type: "file", accept: "image/*" });

      // imageInput.addEventListener("change", (e) => {
      //   const file = e.target.files[0];
      //   if (file) {
      //     compressImage(file, 400, (compressedDataUrl) => {
      //       info.querySelector("img").src = compressedDataUrl;
      //     });
      //   }
      // });

      imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        compressImage(file, 400, (compressedDataUrl) => {
          // Update image inside card info
          const cardImage = info.querySelector("img");
          cardImage.src = compressedDataUrl;
    
          // Also update main display image in .images
          const currentSlide = getCurrentSlide();
          // Get the unique card-X class
          const cardClass = Array.from(card.classList).find(cls => /^card-\d+$/.test(cls));

          // Use it to find the main image in this slide
          const mainImage = currentSlide.querySelector(`.images img.${cardClass}`);

          if (mainImage) {
            mainImage.src = compressedDataUrl;
          }
    
          saveToLocalStorage();
        });
      }
    });

      const saveBtn = createElement("button", {}, ["Save"]);
      saveBtn.addEventListener("click", () => {
        if (titleInput.value) info.querySelector("h3").innerText = titleInput.value;
        info.querySelector(".status").innerText = "Status: " + statusSelect.value;
        info.querySelector(".rating").innerText = "Rating: " + ratingInput.value + "/5";
        info.querySelector(".comment").innerText = "Comment: " + commentInput.value;
        popup.remove();
        saveToLocalStorage();
      });

      const deleteBtn = createElement("button", {}, ["Delete"]);
      deleteBtn.style.backgroundColor = "#f5ff6cff";
      deleteBtn.style.color = "#000";
      deleteBtn.addEventListener("click", () => {
        const confirmPopup = createElement("div", {
          style: `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            padding: 20px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 300px;
          `
        });

        const confirmImage = createElement("img", {
          src: "rock.png",
          style: "width: 100px; margin-bottom: 10px;"
        });

        const confirmText = createElement("p", {
          style: "font-size: 18px; margin-bottom: 15px;"
        }, ["Are you sure??"]);

        const buttonContainer = createElement("div", {
          style: "display: flex; justify-content: space-around; gap: 10px;"
        });

        const okBtn = createElement("button", {
          style: "padding: 6px 14px; background: red; color: white; border-radius: 6px;"
        }, ["OK"]);

        const cancelBtn = createElement("button", {
          style: "padding: 6px 14px; background: gray; color: white; border-radius: 6px;"
        }, ["Cancel"]);

        okBtn.addEventListener("click", () => {
          img.remove();
          card.remove();
          popup.remove();
          confirmPopup.remove();
          updateCardNumbers()
          saveToLocalStorage();
        });

        cancelBtn.addEventListener("click", () => {
          confirmPopup.remove();
        });

        buttonContainer.appendChild(okBtn);
        buttonContainer.appendChild(cancelBtn);
        [confirmImage, confirmText, buttonContainer].forEach(el => confirmPopup.appendChild(el));
        document.body.appendChild(confirmPopup);
      });

      [close, titleInput, statusSelect, ratingInput, commentInput, imageInput, saveBtn, deleteBtn]
        .forEach(el => popup.appendChild(el));

      document.body.appendChild(popup);
    });
  }

  // Initialize existing images
  const currentSlide = getCurrentSlide();
  currentSlide.querySelectorAll('.images img').forEach(img => {
    setupHoverEvents(img);
    setupClickToEdit(img);
  });

  // Book addition handler
  function addBookHandler(){
    const currentSlide = getCurrentSlide();
    const imagesContainer = currentSlide.querySelector(".images");
    const cardsContainer = currentSlide.querySelector(".cards-container");

    const existingBooks = imagesContainer.querySelectorAll("img").length;
    if (existingBooks >= 18) {
      alert("Page full, add new page please");
      return;
    }

    const popup = createElement("div", { class: "popup-form" });
    const close = createElement("i", { class: "fa-solid fa-xmark close-popup" });
    close.addEventListener("click", () => popup.remove());

    const titleInput = createElement("input", { type: "text", placeholder: "Book Title" });
    const statusSelect = createElement("select");
    ["Reading", "Completed", "Wishlist","Dnf"].forEach(status => {
      const opt = createElement("option", { value: status }, [status]);
      statusSelect.appendChild(opt);
    });

    const ratingInput = createElement("input", { type: "number", min: "0", max: "5", step: "0.5", placeholder: "Rating" });
    const commentInput = createElement("textarea", { rows: "3", placeholder: "Comment..." });
    const imageInput = createElement("input", { type: "file", accept: "image/*" });

    const timestamp = new Date().toLocaleString();
    const dateNote = createElement("p", {}, [`Added: ${timestamp}`]);
    dateNote.style = "font-size: 10px; opacity: 0.6;";

    const saveBtn = createElement("button", {}, ["Save"]);
    const deleteBtn = createElement("button", {}, ["Delete"]);
    deleteBtn.style.backgroundColor = "#f5ff6cff";
    deleteBtn.style.color = "#000";

    saveBtn.addEventListener("click", () => {
      const existingBooks = imagesContainer.querySelectorAll("img").length;
      if (existingBooks >= 18) {
        alert("Page full, add new page please");
        return;
      }

      const bookCount = cardsContainer.querySelectorAll(".card").length;
      let imgSrc = "fallback.png";
      const bookTitle = titleInput.value || `Book ${bookCount + 1}`;
      const status = statusSelect.value;
      const rating = ratingInput.value || "N/A";
      const comment = commentInput.value.trim();
      const previewComment = comment.split(" ").slice(0, 4).join(" ") + (comment.split(" ").length > 4 ? "..." : "");
      const cardClass = `card-${bookCount + 1}`;

      function createCardAndImage() {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = bookTitle;
        img.className = cardClass;
        imagesContainer.appendChild(img);

        const card = document.createElement("div");
        card.className = `card ${cardClass}`;

        const info = createElement("div", { class: "info" }, [
          createElement("img", { src: imgSrc, alt: bookTitle }),
          createElement("h3", {}, [bookTitle]),
          createElement("p", { class: "status" }, [`Status: ${status}`]),
          createElement("p", { class: "rating" }, [`Rating: ${rating}/5`]),
          createElement("p", { class: "comment" }, [`Comment: ${previewComment}`]),
          createElement("p", { style: "font-size: 10px; opacity: 0.6;" }, [dateNote.innerText])
        ]);

        const readMore = createElement("div", { class: "read-more" }, [comment]);

        card.appendChild(info);
        card.appendChild(readMore);
        cardsContainer.appendChild(card);

        setupHoverEvents(img);
        setupClickToEdit(img);
        popup.remove();
        saveToLocalStorage();
      }

      if (imageInput.files[0]) {
        const reader = new FileReader();
        compressImage(imageInput.files[0], 400, (compressedDataUrl) => {
        imgSrc = compressedDataUrl;
        createCardAndImage();
      });

      } else {
        createCardAndImage();
      }
    });

    deleteBtn.addEventListener("click", () => {
      const confirmPopup = createElement("div", {
        style: `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          padding: 20px;
          z-index: 10001;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 300px;
        `
      });

      const confirmImage = createElement("img", {
        src: "rock.png",
        style: "width: 100px; margin-bottom: 10px;"
      });

      const confirmText = createElement("p", {
        style: "font-size: 18px; margin-bottom: 15px;"
      }, ["Are you sure??"]);

      const buttonContainer = createElement("div", {
        style: "display: flex; justify-content: space-around; gap: 10px;"
      });

      const okBtn = createElement("button", {
        style: "padding: 6px 14px; background: red; color: white; border-radius: 6px;"
      }, ["OK"]);

      const cancelBtn = createElement("button", {
        style: "padding: 6px 14px; background: gray; color: white; border-radius: 6px;"
      }, ["Cancel"]);

      okBtn.addEventListener("click", () => {
        popup.remove();
        confirmPopup.remove();
        saveToLocalStorage();
      });

      cancelBtn.addEventListener("click", () => {
        confirmPopup.remove();
      });

      buttonContainer.appendChild(okBtn);
      buttonContainer.appendChild(cancelBtn);
      [confirmImage, confirmText, buttonContainer].forEach(el => confirmPopup.appendChild(el));
      document.body.appendChild(confirmPopup);
    });

    [close, titleInput, statusSelect, ratingInput, commentInput, imageInput, dateNote, saveBtn, deleteBtn]
      .forEach(el => popup.appendChild(el));

    document.body.appendChild(popup);
  }

  // Add book button binding
  const addBookBtn = document.querySelector(".add-new-book button");
  addBookBtn.addEventListener("click", addBookHandler);

  // Slide management
  addSlideButton = document.querySelector("#add-slide-btn");
  addSlideButton.addEventListener("click", () => {
    const currentSlides = allSlides();
    const newIndex = currentSlides.length;
    createNewSlide(newIndex);
    saveToLocalStorage();
  });

  function allSlides() {
    return document.querySelectorAll(".slide");
  }

  function showSlide(index) {
    const slides = allSlides();
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "flex" : "none";
    });
    document.getElementById("slider-label").innerText = `Slide ${index + 1}`;
    document.getElementById("slide-range").value = index + 1;
  }

  document.getElementById("slide-range").addEventListener("input", (e) => {
    const index = parseInt(e.target.value) - 1;
    showSlide(index);
  });

  function updateSlideRange() {
    const slides = allSlides();
    const slideRange = document.getElementById("slide-range");
    slideRange.max = slides.length;
    slideRange.value = 1;
    document.getElementById("slider-label").innerText = `Slide 1`;
  }

  function renumberSlides() {
    const slides = allSlides();
    slides.forEach((slide, index) => {
      slide.className = slide.className.replace(/slide-\d+/g, '');
      slide.classList.add(`slide-${index + 1}`);
    });
  }

  // Create new slide
  function createNewSlide(index) {
    const newSlide = document.createElement("div");
    newSlide.className = `slide slide-${index + 1}`;
    newSlide.style.display = "none";
    newSlide.innerHTML = `
      <div class="heading">
        <h1 class="title">my reading journal</h1>
        <i id="edit-heading" class="fa-solid fa-pen"></i>
        <input id="input-heading" type="text" placeholder="hiii type something :)">
      </div>
      <div class="cards-container">
        <div class="images"></div>
      </div>
    `;

    document.body.appendChild(newSlide);
    initializeSlide(newSlide);
    const slideRange = document.getElementById("slide-range");
    slideRange.max = allSlides().length;
    showSlide(index);
  }

  // Initialize slide elements
  function initializeSlide(slideEl) {
    // rebindGlobals();
  }

  // Slide deletion
  function deleteSlide() {
    const currentSlide = getCurrentSlide();
    const all = allSlides();

    if (all.length === 1) {
      alert("You must have at least one slide. This slide cannot be deleted.");
      return;
    }

    const cards = currentSlide.querySelectorAll(".card");
    if (cards.length > 0) {
      alert("Please delete all books in this slide before deleting the slide.");
      return;
    }

    currentSlide.remove();
    renumberSlides();
    updateSlideRange();
    showSlide(0);
    saveToLocalStorage();
  }
  document.getElementById("delete-slide-btn").addEventListener("click", deleteSlide);

  // Initial setup
  initializeSlide(document.querySelector(".slide"));
  showSlide(0);

  // Rebind all global event handlers
  function rebindGlobals() {
    const colorButton = document.querySelector(".change-color");
    const colorInput = document.querySelector("#change-color");
    const editHeading = document.querySelector("#edit-heading");
    const inputHeading = document.querySelector("#input-heading");
    const deleteSlideBtn = document.querySelector("#delete-slide-btn");

    if (colorButton && colorInput) {
      colorButton.addEventListener("click", () => colorInput.click());
      colorInput.addEventListener("input", (e) => {
        const currentSlide = getCurrentSlide();
        currentSlide.style.backgroundColor = e.target.value;
      });
    }

    if(deleteSlideBtn){
      deleteSlideBtn.addEventListener("click",deleteSlide);
    }

    if (editHeading && inputHeading) {
      editHeading.addEventListener("click", () => {
        inputHeading.style.display = "block";
      });

      inputHeading.addEventListener("input", (e) => {
        const currentSlide = getCurrentSlide();
        const title = currentSlide.querySelector(".title");
        if (title) title.innerText = e.target.value;
      });

      inputHeading.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const currentSlide = getCurrentSlide();
          const title = currentSlide.querySelector(".title");
          if (title) title.innerText = e.target.value;
          inputHeading.style.display = "none";
        }
      });
    }

    document.querySelector(".add-new-book button")?.addEventListener("click", addBookHandler);
    document.querySelector("#add-slide-btn")?.addEventListener("click", () => {
      const currentSlides = allSlides();
      const newIndex = currentSlides.length;
      createNewSlide(newIndex);
      saveToLocalStorage();
    });

    document.getElementById("slide-range")?.addEventListener("input", (e) => {
      const index = parseInt(e.target.value) - 1;
      showSlide(index);
    });
  }

  // Persistence
  function saveToLocalStorage() {
    localStorage.setItem("readingJournal", document.body.innerHTML);
  }
  window.addEventListener("beforeunload", saveToLocalStorage);
});
