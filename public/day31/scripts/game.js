let wordCheck;
let input;

const start = new Audio("media/music/240254__sonic-ranger__a-bee.wav");
const finish = new Audio("media/music/220691__pep-molina__woohoo.mp3");
let audio = [];

const height = window.innerHeight * 0.01;
document.getElementsByClassName('splash')[0].style.setProperty('--vh', `${height}px`);
document.getElementsByClassName('wrapper')[0].style.setProperty('--vh', `${height}px`);
document.getElementsByClassName('game-board')[0].style.setProperty('--vh', `${height}px`);

// Listen to resize event
window.addEventListener('resize', () => {
// We execute the same script as before
const height = window.innerHeight * 0.01;
document.getElementsByClassName('splash')[0].style.setProperty('--vh', `${height}px`);
document.getElementsByClassName('wrapper')[0].style.setProperty('--vh', `${height}px`);
document.getElementsByClassName('game-board')[0].style.setProperty('--vh', `${height}px`);
});


function getNewWord() {

    const wordButton = document.getElementById("playsound");
    wordButton.addEventListener('click', function() {

        let randomItem = words[Math.floor(Math.random()*words.length)];
        document.getElementById("definition").innerHTML = randomItem.Definition;
        wordCheck = randomItem.Word;
        audio[0] = new Audio();
        audio[0].src = "media/music/"+wordCheck+".m4a";
        audio[0].play();
        document.getElementById("definition").style.display = "block";
        const def = document.getElementsByClassName("def-p")[0];
        def.style.display = "block";
        return wordCheck;
    });

}
getNewWord();


const words = [{
    Word: "Onomatopoeia",
    Definition: "The naming of a thing or action by a vocal imitation of the sound associated with it (such as buzz, hiss)."
}, {
    Word: "Disappoint",
    Definition: "To fail to meet the expectation or hope of."
}, {
    Word: "Camaraderie",
    Definition: "A spirit of friendly good-fellowship."
}, {
    Word: "Abysmal",
    Definition: "Immeasurably low or wretched, extremely poor or bad."
}, {
    Word: "Aficionado",
    Definition: "A person who likes, knows about, and appreciates a usually fervently pursued interest or activity."
}, {
    Word: "Ancillary",
    Definition: "Subordinate, susidiary."
}, {
    Word: "Auxiliary",
    Definition: "Offering or providing help."
}, {
    Word: "Bourgeoisie",
    Definition: "Middle class, a class or group of people with social behavior and political views held to be influenced by private-property interest."
}, {
    Word: "Connoisseur",
    Definition: "One who understands the details, technique, or principles of an art and is competent to act as a critical judge."
}, {
    Word: "Curmudgeon",
    Definition: "A crusty, ill-tempered, and usually old man."
}, {
    Word: "Daiquiri",
    Definition: "An alcoholic drink that is usually made of rum, crushed fruit or fruit juice, and sugar."
}, {
    Word: "Entrepreneur",
    Definition: "One who organizes, manages, and assumes the risks of a business or enterprise."
}, {
    Word: "Hydraulics",
    Definition: "A branch of science that deals with practical applications (such as the transmission of energy or the effects of flow) of liquid (such as water) in motion."
}, {
    Word: "Inoculate",
    Definition: "To introduce immunologically active material (such as an antibody or antigen) into especially in order to treat or prevent a disease."
}, {
    Word: "Memento",
    Definition: "Something that serves to warn or remind."
}, {
    Word: "Misspell",
    Definition: "To spell incorrectly."
}, {
    Word: "Paradigm",
    Definition: "Example, pattern, an outstandingly clear or typical example or archetype."
}, {
    Word: "Paraphernalia",
    Definition: "Personal belongings."
}, {
    Word: "Pharaoh",
    Definition: "A ruler of ancient Egypt."
}, {
    Word: "Recommend",
    Definition: "To endorse as fit, worthy, or competent."
}, {
    Word: "Repertoire",
    Definition: "A list or supply of dramas, operas, pieces, or parts that a company or person is prepared to perform."
}, {
    Word: "Ricochet",
    Definition: "A glancing rebound (as of a projectile off a flat surface)."
}, {
    Word: "Sergeant",
    Definition: "An officer who enforces the judgments of a court or the commands of one in authority."
}, {
    Word: "Succinctly",
    Definition: "Marked by compact precise expression without wasted words."
}, {
    Word: "Supersede",
    Definition: "To cause to be set aside, to take the place or position of."
}, {
    Word: "Vacuum",
    Definition: "Emptiness of space, a degree of rarefaction below atmospheric pressure."
}, {
    Word: "Vengeance",
    Definition: "With great force or vehemence, to an extreme or excessive degree."
}
];

function submitSpelling() {

    submit = document.getElementsByClassName("submit")[0];
    submit.addEventListener("click", function(e){
        input = document.getElementById("typeword").value;
        if ( input.toLowerCase() == wordCheck.toLowerCase() ) {
            e.preventDefault();
            document.getElementsByClassName("card-container")[0].style.display = "block";
            document.getElementById("endgame").style.display = "block";
            document.querySelector(".endgame .text").innerText = "Nice work! You spelled " + wordCheck.toLowerCase() + " perfectly.";
            document.querySelector(".nextword").innerText = "Next word";
        }else{
            e.preventDefault();
            document.getElementsByClassName("card-container")[0].style.display = "block";
            document.getElementById("endgame").style.display = "block";
            document.querySelector(".endgame .text").innerText = "Almost! The correct spelling is " + wordCheck.toLowerCase() + ". You'll get it next time!";
            document.querySelector(".nextword").innerText = "Next word";
        }
    });

}
submitSpelling();



function nextWord() {
    document.getElementById("nextword").addEventListener('click', function(){

        for (let i = 0; i < words.length; i++) {
            if ( words[i].Word.toLowerCase() == input.toLowerCase()){
                words.splice(i, 1);
            }
        }
        document.getElementsByClassName("card-container")[0].style.display = "none";
        document.getElementById("definition").innerHTML = "";
        document.getElementById("typeword").value = "";

        if (!Array.isArray(words) || !words.length) {
            document.getElementsByClassName("card-container")[0].style.display = "block";
            document.getElementById("endgame").style.display = "block";
            document.getElementById("endgame").style.backgroundColor = "black";
            document.getElementById("text").style.color = "white";
            document.querySelector(".endgame .text").innerText = "Well done - you got through all the words! You're on your way to spelling the whole dictionary. Keep it up!";
            document.querySelector(".nextword").innerText = "Play again";
            document.querySelector(".nextword").style.backgroundColor = "#fed420";
            document.querySelector(".nextword").style.color = "black";
            document.querySelector(".nextword").style.boxShadow = "5px 5px 1px white";
            finish.play();
            
            const playAgain = document.querySelector(".nextword");
            playAgain.addEventListener('click', function() {

                location.reload();

            })
          }
    });
}
nextWord();
