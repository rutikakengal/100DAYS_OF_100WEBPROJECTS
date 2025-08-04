const adjectives = [
    "Quantum", "Pixel", "Turbo", "Neon", "Hyper", "Fusion", "Smart",
  "Cyber", "Blue", "Swift", "Dynamic", "Electric", "Nova", "Glitchy",
  "Cloudy", "Zen", "Silent", "Clever", "Bold", "Alpha"
];
const nouns = [
    "Panda", "Rocket", "Falcon", "Circuit", "Wave", "Ninja", "Galaxy",
  "Bot", "Fox", "Engine", "Code", "Vortex", "AI", "Module", "Loop",
  "Signal", "Hub", "Lab", "Matrix", "Studio"
];

function getRandomWord(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function generateName() {
    const adjective = getRandomWord(adjectives);
    const noun = getRandomWord(nouns);
    const startupName = `${adjective} ${noun}`;
    document.getElementById("nameDisplay").textContent = startupName;
}
function copyToClipboard() {
    const name = document.getElementById("nameDisplay").textContent;
     if (!name || name === "Click \"Generate\" to start!"){
        alert("Please generate a name first.");
        return;
     }
     navigator.clipboard.writeText(name).then(() => {
        alert("Copied to clipboard!");
     });
}

function saveFavorite() {
    const name = document.getElementById("nameDisplay").textContent;
    if(!name || name === "Click \"Generate\" to start!") return;

    const favoritesList = document.getElementById("favoritesList");
    const listItem = document.createElement("li");
    listItem.textContent = name;
    favoritesList.appendChild(listItem);
}