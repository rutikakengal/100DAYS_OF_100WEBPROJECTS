const destinations = [
  {
    name: "One Piece",
    image: "download__2_-removebg-preview.png",
    secondImage:"download (3).jpeg",
    fact: "The world of One Piece, beneath its oceans and laughter, hides a storm of chaos and blood. The sea isn’t freedom — it’s a graveyard of ships and dreams, ruled by monsters both human and not. Islands vanish into legend, swallowed by secrets the World Government silences with death. The Devil Fruits offer power, but at a price — the sea rejects you, and something darker always watches from the depths. Pirates laugh, but their hands are stained with betrayal, war, and fire. The sky cracks during battles between gods of flesh and bone, while ancient weapons sleep beneath ruins soaked in forgotten screams. In this twisted dream of freedom, justice is warped, history is erased, and those who chase the horizon often never return. Not all treasure is gold — some of it is cursed."
  },
  {
    name: "IT",
    image: "download__4_-removebg-preview.png",
    secondImage:"download (5).jpeg",
    fact: "The world feels like a twisted nightmare, forever trapped in a dim, colorless twilight. Fog slithers through the streets, hiding things that shouldn’t exist. Buildings groan like they’re alive, and doors often lead to places they shouldn’t — endless staircases, blood-soaked rooms, or silent forests with no end. Time doesn’t move normally here; it loops, freezes, or jumps, making you question reality. The people you see have empty eyes, unnatural smiles, and speak in whispers or riddles. Even reflections lie — mirrors show you not yourself, but your fears. The air is heavy, the silence too loud, and every step feels like something is watching you… just waiting for you to blink."
  },
  {
    name: "Death Note",
    image: "Ryuk_Light_Yagami_Death_Note_Tsugumi_Ohba_PNG-removebg-preview.png",
    secondImage:"download (6).jpeg",
    fact: "The world of Death Note is a quiet descent into darkness, where death hides behind a pen stroke and justice wears many faces. It feels calm on the surface — classrooms, cities, news reports — but beneath it brews a chilling power: the Death Note, a notebook that kills with a name and a face. Shadows stretch longer around its owner, Light Yagami, whose god complex twists morality into madness. As names are written, souls vanish silently, and the line between right and wrong blurs into gray. The Shinigami, gods of death, hover above it all with empty eyes and rotten wings, watching humans destroy themselves for power. In this world, fear isn't loud — it's precise, calculated, and written in ink. You don’t hear death coming. You just stop being."
  },
  {
    name: "Pika world",
    image: "download__7_-removebg-preview.png",
    secondImage:"pika.jpeg",
    fact: "The Pokémon world, once bright and full of wonder, turns haunting when seen through darker eyes. Wild cries echo from deep forests where eyes glow in the dark, watching silently. Abandoned Poké Balls rattle in the grass, their trainers long gone. Ghost-type Pokémon roam empty towns, whispering names and stealing warmth. Laboratories hide secrets — experiments, failed fusions, and unnatural evolutions. Some Pokémon evolve not by growth, but through pain or loss. Lavender Town’s music still lingers, carrying sorrow and things unsaid. In this world, battles are more than games — they’re survival. And sometimes, the monsters aren’t just in the tall grass… they're the ones holding the Pokédex."
  },
  {
    name: "Grave of fire flies",
    image: "Grave_of_the_Fireflies__1_-removebg-preview.png",
    secondImage:"grave of the fireflies.jpeg",
    fact: "The world of Grave of the Fireflies is silent and broken, a dream turned to ashes beneath a sky that no longer remembers stars. War has drained the color from everything — cities crumble, rivers carry the weight of the dead, and fireflies glow not with hope, but with grief. The air is thick with smoke and sorrow, where even the laughter of children sounds like an echo from the past. Hunger gnaws at the soul more than the body, and every kindness comes too late. Bombs fall like rain, but it's the silence afterward that haunts most. In this world, the true horror isn’t monsters — it’s loneliness, forgotten lives, and the slow fading of light from eyes too young to understand why the world stopped caring."
  }
];

// Spin function
function spinGlobe() {
  const globe = document.getElementById("globe");
  globe.classList.add("spinning");

  setTimeout(() => {
    globe.classList.remove("spinning");

    // Pick a random destination
    const chosen = destinations[Math.floor(Math.random() * destinations.length)];

    document.getElementById("placeName").textContent = chosen.name;
     document.getElementById("placeFact").textContent = chosen.fact;
    document.getElementById("placeImageFront").src = chosen.image;
    document.getElementById("placeImageBack").src = chosen.secondImage;
   
    // Hide spin view, show destination
    document.getElementById("spinPage").style.display = "none";
    document.getElementById("destinationPage").style.display = "flex";

    // Switch theme
    document.body.classList.remove("spin-theme");
    document.body.classList.add("destination-theme");
  }, 4000); // Matches the globe spin animation time
}

// Go back function
function goBack() {
  document.getElementById("spinPage").style.display = "block";
  document.getElementById("destinationPage").style.display = "none";

  document.body.classList.remove("destination-theme");
  document.body.classList.add("spin-theme");
}
