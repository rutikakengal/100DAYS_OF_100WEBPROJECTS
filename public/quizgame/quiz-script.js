const questions = {
  html: [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Mark Language", "Hyper Tool Modern Language"], answer: 0 },
    { question: "Which tag is used to insert a line break?", options: ["<br>", "<lb>", "<break>", "<hr>"], answer: 0 },
    { question: "Which tag inserts an image?", options: ["<image>", "<img>", "<pic>", "<src>"], answer: 1 },
    { question: "Which attribute sets a link?", options: ["link", "src", "href", "url"], answer: 2 },
    { question: "Which tag is for ordered lists?", options: ["<ol>", "<ul>", "<list>", "<nl>"], answer: 0 },
    { question: "Which tag defines a table row?", options: ["<tr>", "<td>", "<th>", "<row>"], answer: 0 },
    { question: "Which is a self-closing tag?", options: ["<div>", "<span>", "<br>", "<p>"], answer: 2 },
    { question: "Purpose of <title> tag?", options: ["Display in body", "Heading", "Tab title", "Style title"], answer: 2 },
    { question: "Block-level grouping tag?", options: ["<div>", "<span>", "<section>", "<group>"], answer: 0 },
    { question: "Where is <meta charset> used?", options: ["After body", "Inside body", "In head", "After title"], answer: 2 }
  ],
  css: [
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Syntax", "Colorful Style Sheet"], answer: 1 },
    { question: "Which tag links external CSS?", options: ["<css>", "<style>", "<link>", "<script>"], answer: 2 },
    { question: "Select ID 'header'", options: ["#header", ".header", "header", "*header"], answer: 0 },
    { question: "Default position value?", options: ["relative", "fixed", "absolute", "static"], answer: 3 },
    { question: "Make class italic?", options: ["main { text-decoration: italic; }", ".main { font-style: italic; }", "#main { font-italic: true; }", ".main { text-style: italic; }"], answer: 1 },
    { question: "Text size property?", options: ["text-size", "font-style", "font-size", "text-style"], answer: 2 },
    { question: "Style <p> inside <div>?", options: ["div p", "p div", "#div > p", "div.p"], answer: 0 },
    { question: "Background color?", options: ["bg-color", "color-background", "background-color", "bgcolor"], answer: 2 },
    { question: "Hide element?", options: ["hidden", "none", "invisible", "block"], answer: 1 },
    { question: "z-index controls?", options: ["Text alignment", "Layer stacking", "Image brightness", "Border thickness"], answer: 1 }
  ],
  js: [
    { question: "Keyword to declare variable?", options: ["var", "int", "define", "declare"], answer: 0 },
    { question: "Symbol for comments?", options: ["#", "<!-- -->", "//", "**"], answer: 2 },
    { question: "Write a function?", options: ["function = myFunc() {}", "function myFunc() {}", "def myFunc() {}", "fn myFunc() {}"], answer: 1 },
    { question: "Create alert box?", options: ["msg()", "alert()", "prompt()", "notify()"], answer: 1 },
    { question: "`typeof 'hello'` returns?", options: ["string", "text", "word", "object"], answer: 0 },
    { question: "If statement syntax?", options: ["if x > 5 then", "if (x > 5)", "if x > 5:", "when (x > 5)"], answer: 1 },
    { question: "Convert to int?", options: ["parseFloat()", "Number()", "parseInt()", "int()"], answer: 2 },
    { question: "getElementById does what?", options: ["Select <demo>", "Get document", "Select ID demo", "Set ID"], answer: 2 },
    { question: "Event for clicking?", options: ["onchange", "onclick", "onhover", "onpress"], answer: 1 },
    { question: "Correct for loop?", options: ["for (i = 0; i < 5; i++)", "for i = 1 to 5", "for (i in 1...5)", "loop (i = 0; i < 5; i++)"], answer: 0 }
  ]
};

const tabButtons = document.querySelectorAll(".tab-btn");
const quizContainer = document.querySelector(".quiz-window");
const questionTitle = document.getElementById("question-title");
const optionsContainer = document.querySelector(".options-container");
const openingContainer = document.querySelector(".opening-container")
const nextBtn = document.getElementById("next-btn");
const brownieContainer = document.querySelector(".brownie-container");
let browniePoints = 0;   /*to count the brownie points*/
let selectedAnswerIndex = null; /*Stores the index of the selected answer: To check whether it is right or wrong*/
const finalContainer = document.getElementById("final-message-container");
const resetBtn = document.getElementById("reset-btn");
const resetBtnContainer = document.getElementById("reset-btn-container");



const browniePointsDisplay = document.getElementById("brownie-points-count"); /*id of the brownie count element*/
const progressBar = document.getElementById("progress-bar");

let currentTopic = ""; //to store the topic chosen by the user
let currentIndex = 0; //to store the index of the question inside that topic

//When any of the tab button(HTML, CSS OR JS) is clicked
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    resetBtnContainer.classList.remove("hide"); // show reset when quiz starts
    openingContainer.classList.add("hide"); //Hiding the opening screen
    quizContainer.classList.remove("hide"); //Showing the quiz interface
    brownieContainer.classList.remove("hide");// Show brownie point bar

    currentTopic = button.getAttribute("data-topic"); //Get the topic or tab selected
    currentIndex = 0; //first question of the topic
    browniePoints = 0;        // Reset score
    selectedAnswerIndex = null;
    browniePointsDisplay.textContent = 0;  // Reset display
    progressBar.innerHTML = "";            // Clear previous cookies

    //Displaying the question
    console.log("Topic chosen:", currentTopic);
    showQuestion();
  });
});

//Display of Questions after a tab selection and its options 
function showQuestion() {
  const questionData = questions[currentTopic][currentIndex]; //Current question
  questionTitle.textContent = `${currentIndex + 1}. ${questionData.question}`;
  optionsContainer.innerHTML = "";

  //Creating buttons for options to each question
  questionData.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");

    //For the selected option: Highlighting it
    btn.addEventListener("click", () => {
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedAnswerIndex = index; //This is the index of the selected answer
    });

    optionsContainer.appendChild(btn); //Adding the options buttons to the optionsContainer
  });
}

//Functionality of the next button
nextBtn.addEventListener("click", () => {
  if(selectedAnswerIndex == null) return; //we have to select an answer before next Question

  const correctAnswer = questions[currentTopic][currentIndex].answer; //This is the index of the correct answer

  //When the answer is correct, updating brownie points and display
  if (selectedAnswerIndex === correctAnswer) {
    browniePoints++;
    browniePointsDisplay.textContent = browniePoints;

    //Adding a cookie emoji as a token
    const cookie = document.createElement("span");
    cookie.classList.add("cookie", "gained");
    cookie.textContent = "🍪";
    progressBar.appendChild(cookie);
  }
  //When answer is Wrong
  else{
    const wrong = document.createElement("span");
    wrong.classList.add("wrong");
    wrong.textContent = "❌";
    progressBar.appendChild(wrong);
  }
  // Moving to the next question
  selectedAnswerIndex = null; // Reset selected index
  currentIndex++; // Increment question index

  //When the quiz still has questions left of the selected topic
  if (currentIndex < questions[currentTopic].length) {
    showQuestion();
  } 
  //When the quiz reaches last question of the selected topic
  else {
    quizContainer.classList.add("hide"); /*Hiding the quiz window */
    brownieContainer.classList.add("hide"); // Hide progress bar and live score
    progressBar.classList.add("hide");

    const finalContainer = document.getElementById("final-message-container");
    finalContainer.innerHTML = ""; // Clear old content if any
    // Creating final message container
    
    const finalMessage = document.createElement("p");
    finalMessage.classList.add("final-message");
    finalMessage.innerHTML = `Hey, you have gained <strong>${browniePoints}</strong> cookie points.`;


    //Selecting the reward based on score
    const reward = document.createElement("div");
    reward.classList.add("reward");
    reward.style.fontSize = "5rem";
    reward.style.marginTop = "20px";
    reward.style.padding = "30px";
    reward.style.borderRadius = "15px"

    if (browniePoints > 6) {
      finalMessage.innerHTML += "<br>Congratulations topper!!<br>You are really good at this!";
      reward.textContent = "🎂"; // Cake emoji
      reward.style.backgroundColor = "#ffe6f0";

    } else if (browniePoints === 5) {
      finalMessage.innerHTML += "<br>You are getting there. Hang tight<br>Here's a treat for you!";
      reward.textContent= "🍰"; // Pastry emoji
      reward.style.backgroundColor = "#ffe4b5"; // Moccasin pastel
    } else {
      finalMessage.innerHTML += "<br>Don't give up champ<br>Here's a treat!";
      reward.textContent = "🍫"; // Brownie emoji
      reward.style.backgroundColor = "#d0f0c0"; // Tea green pastel
    }
    // Appending message and reward into container
    finalContainer.appendChild(finalMessage);
    finalContainer.appendChild(reward);
    
    //Making final container visible
    finalContainer.classList.remove("hide");
  }
});

resetBtn.addEventListener("click", () => {
  // Reset state
  currentIndex = 0;
  browniePoints = 0;
  browniePointsDisplay.textContent = browniePoints;
  progressBar.innerHTML = "";

  // Hiding quiz-related sections
  quizContainer.classList.add("hide");
  brownieContainer.classList.add("hide");
  resetBtnContainer.classList.add("hide");
  finalContainer.classList.add("hide");
  document.querySelector(".completion-message")?.classList.add("hide");

  openingContainer.classList.remove("hide");

  // Show topic buttons again
  document.querySelector(".tab-container").classList.remove("hide");
  document.querySelector(".title-container").classList.remove("hide");

  //Resetting the elements
  questionTitle.textContent = "";
  optionsContainer.innerHTML = "";
});
