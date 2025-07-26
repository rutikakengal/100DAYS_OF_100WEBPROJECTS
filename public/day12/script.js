const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultContainer = document.getElementById("resultContainer");

const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const playAudio = document.getElementById("playAudio");
const partOfSpeechEl = document.getElementById("partOfSpeech");
const definitionList = document.getElementById("definitionList");
const synonymsList = document.getElementById("synonymsList");
const examplesList = document.getElementById("examplesList");

let audioUrl = "";

searchBtn.addEventListener("click", () => {
  const word = searchInput.value.trim();
  if (word) {
    fetchWordData(word);
  }
});

async function fetchWordData(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWordData(data[0]);
  } catch (error) {
    alert("Word not found. Please try another word.");
    resultContainer.classList.add("hidden");
  }
}

function displayWordData(data) {
  resultContainer.classList.remove("hidden");

  wordEl.textContent = data.word;
  phoneticEl.textContent = data.phonetic || "";

  const meanings = data.meanings[0];
  const definitions = meanings.definitions;
  const synonyms = meanings.synonyms || [];
  const examples = definitions.map(d => d.example).filter(Boolean);

  partOfSpeechEl.textContent = meanings.partOfSpeech;

  definitionList.innerHTML = "";
  definitions.forEach(def => {
    const li = document.createElement("li");
    li.textContent = def.definition;
    definitionList.appendChild(li);
  });

  synonymsList.innerHTML = synonyms.length ? "" : "<li>None</li>";
  synonyms.forEach(syn => {
    const li = document.createElement("li");
    li.textContent = syn;
    li.style.color = "#db4cd2";
    synonymsList.appendChild(li);
  });

  examplesList.innerHTML = examples.length ? "" : "<li>None</li>";
  examples.forEach(example => {
    const li = document.createElement("li");
    li.textContent = example;
    examplesList.appendChild(li);
  });

  const phonetics = data.phonetics.find(p => p.audio);
  audioUrl = phonetics ? phonetics.audio : "";

  playAudio.onclick = () => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };
}
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
        document.body.removeAttribute("data-theme");
    } else {
        document.body.setAttribute("data-theme", "dark");
    }
});
