/* =========================
   CONFIG
   ========================= */
const OPEN_HOUR = 9;
const CLOSE_HOUR = 19;
const STEP_MIN = 60;

/* =========================
   HELPERS
   ========================= */
function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime(minutesFromMidnight) {
  const h = Math.floor(minutesFromMidnight / 60);
  const m = minutesFromMidnight % 60;
  return `${pad(h)}:${pad(m)}`;
}

function minutes(h, m = 0) {
  return h * 60 + m;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* =========================
   SLOT GENERATION
   ========================= */
function buildSlotsForDate(dateObj) {
  const start = minutes(OPEN_HOUR, 0);
  const end = minutes(CLOSE_HOUR, 0);

  const slots = [];
  for (let t = start; t <= end; t += STEP_MIN) {
    slots.push(formatTime(t));
  }

  const now = new Date();
  if (isSameDay(dateObj, now)) {
    const nowMin = minutes(now.getHours(), now.getMinutes()) + 10;

    return slots.filter((hhmm) => {
      const [h, m] = hhmm.split(":").map(Number);
      return minutes(h, m) >= nowMin;
    });
  }

  return slots;
}

/* =========================
   UI RENDER
   ========================= */
function renderTimeOptions(selectEl, slots) {
  selectEl.innerHTML = "";

  if (slots.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No times available";
    opt.disabled = true;
    opt.selected = true;
    selectEl.appendChild(opt);
    selectEl.disabled = true;
    return;
  }

  selectEl.disabled = false;

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a time";
  placeholder.disabled = true;
  placeholder.selected = true;
  selectEl.appendChild(placeholder);

  slots.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    selectEl.appendChild(opt);
  });
}

/* =========================
   FORM VALIDATION
   ========================= */
function setFieldState(fieldEl, errorEl, message) {
  if (!fieldEl) return;

  const wrapper = fieldEl.closest(".field");
  const hasError = Boolean(message);

  if (wrapper) {
    wrapper.classList.toggle("is-invalid", hasError);
    wrapper.classList.toggle(
      "is-valid",
      !hasError && String(fieldEl.value || "").trim() !== ""
    );
  }

  fieldEl.setAttribute("aria-invalid", hasError ? "true" : "false");

  if (errorEl) {
    errorEl.textContent = message || "";
  }
}

function validateForm(formEl) {
  let ok = true;

  const nameField = document.getElementById("name");
  const dateField = document.getElementById("date");
  const timeField = document.getElementById("time");

  const nameError = document.getElementById("nameError");
  const dateError = document.getElementById("dateError");
  const timeError = document.getElementById("timeError");

  if (nameField && !nameField.value.trim()) {
    setFieldState(nameField, nameError, "Please enter your name.");
    ok = false;
  } else if (nameField) {
    setFieldState(nameField, nameError, "");
  }

  if (dateField && !dateField.value.trim()) {
    setFieldState(dateField, dateError, "Please select a date.");
    ok = false;
  } else if (dateField) {
    setFieldState(dateField, dateError, "");
  }

  if (timeField && !timeField.value) {
    setFieldState(timeField, timeError, "Please select a time.");
    ok = false;
  } else if (timeField) {
    setFieldState(timeField, timeError, "");
  }

  if (!ok && formEl) {
    const firstInvalid = formEl.querySelector(
      ".is-invalid input, .is-invalid select, .is-invalid textarea"
    );
    if (firstInvalid) firstInvalid.focus();
  }

  return ok;
}

/* =========================
   INIT
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const formEl = document.getElementById("bookingForm");

  const selectedServiceEl = document.getElementById("selectedService");
  const selectedPriceEl = document.getElementById("selectedPrice");
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");

  if (!dateEl || !timeEl) return;

  const params = new URLSearchParams(window.location.search);
  const service = params.get("service") || "Custom Cut";
  const price = params.get("price");

  if (selectedServiceEl) selectedServiceEl.textContent = service;
  if (selectedPriceEl) selectedPriceEl.textContent = price ? `$${price}` : "$—";

  const picker = flatpickr(dateEl, {
    dateFormat: "d/m/Y",
    minDate: "today",
    disable: [(date) => date.getDay() === 0],
    defaultDate: new Date(),
    onChange: function (selectedDates) {
      const d = selectedDates[0];
      renderTimeOptions(timeEl, buildSlotsForDate(d));

      setFieldState(dateEl, document.getElementById("dateError"), "");
      if (timeEl && !timeEl.disabled) {
        setFieldState(timeEl, document.getElementById("timeError"), "");
      }
    },
  });

  const initialDate = picker.selectedDates[0] || new Date();
  renderTimeOptions(timeEl, buildSlotsForDate(initialDate));

  if (formEl) {
    formEl.addEventListener("submit", (e) => {
      if (!validateForm(formEl)) e.preventDefault();
    });

    ["input", "change"].forEach((evt) => {
      formEl.addEventListener(evt, (e) => {
        const el = e.target;
        if (!el) return;

        if (el.id === "name") {
          setFieldState(
            el,
            document.getElementById("nameError"),
            el.value.trim() ? "" : "Please enter your name."
          );
        }

        if (el.id === "date") {
          setFieldState(
            el,
            document.getElementById("dateError"),
            el.value.trim() ? "" : "Please select a date."
          );
        }

        if (el.id === "time") {
          setFieldState(
            el,
            document.getElementById("timeError"),
            el.value ? "" : "Please select a time."
          );
        }
      });
    });
  }
});
