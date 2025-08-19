function checkPhotostability() {
  let input = document.getElementById("ingredients").value.toLowerCase();

  input = input.replace(/[\.,;:()\-\n\r]/g, " ").replace(/\s+/g, " ");

  const avobenzone = [
    "avobenzone",
    "butyl methoxydibenzoylmethane",
    "bmbm",
    "parsol1789",
    "eusolex 9020",
  ];
  const octocrylene = [
    "octocrylene",
    "2-ethylhexyl 2-cyano-3, 3-diphenylacrylate",
  ];
  const octinoxate = [
    "octinoxate",
    "ethylhexyl methoxycinnamate",
    "omc",
    "ehmc",
    "parsol mcx",
  ];
  const zinc = ["zinc oxide"];
  const titanium = ["titanium dioxide"];
  const modernFilters = [
    "diethylamino hydroxybenzoyl hexyl benzoate", //Uvinul A Plus
    "ethylhexyl triazone", //Uvinul T 150
    "bis-ethylhexyloxyphenol methoxyphenyl triazine", //Tinosorb S
  ];

  function contains(list) {
    return list.some((name) => input.includes(name));
  }

  const hasAvobenzone = contains(avobenzone);
  const hasOctocrylene = contains(octocrylene);
  const hasOctinoxate = contains(octinoxate);
  const hasZinc = contains(zinc);
  const hasTitanium = contains(titanium);
  const hasModern = contains(modernFilters);

  let result = "Not enough information.";

  if (hasAvobenzone && hasOctinoxate && hasOctocrylene) {
    result = "❌ Not Recommended - Avobenzone + Octionoxate + Octocrylene is unstable.";
  } else if (hasAvobenzone && hasOctinoxate) {
    result = "❌ Not Recommended - Avobenzone + Octinoxate is unstable.";
  } else if (hasAvobenzone && hasOctocrylene) {
    result = "✅ Recommended - Avobenzone is stabilized by Octocrylene.";
  } else if (hasOctinoxate && !hasAvobenzone) {
    result = "✅Recommended - Octinoxate alone is stable.";
  } else if (hasAvobenzone && hasOctinoxate && (hasZinc || hasTitanium)) {
    result =
      "Conditionally OK - Has unstable combo, but Zinc/Titanium might help.";
  } else if (hasModern || hasZinc || hasTitanium) {
    result = "✅ Recommended - Contains photostable filters.";
  }

  document.getElementById("result").textContent = result;
}

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const response = document.getElementById("formResponse");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        response.textContent = "Thank you for reaching out! I’ll get back to you soon! :)";
        form.reset();
      } else {
        response.textContent = "Oops! Something went wrong. Please try again.";
      }
    } catch (error) {
      response.textContent = "Network error. Please try again later.";
    }
  });
});

