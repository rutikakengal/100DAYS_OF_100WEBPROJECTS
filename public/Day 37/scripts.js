const hrQuestions = [
  "Tell me about yourself.", "What are your strengths and weaknesses?",
  "Why should we hire you?", "Where do you see yourself in 5 years?",
  "Describe a challenge you faced and how you handled it.",
  "What motivates you?", "Tell me about a time you failed.",
  "What are your career goals?", "Describe your ideal work environment.",
  "What is your biggest achievement?", "What do you know about our company?",
  "Why do you want this job?", "How do you handle stress or pressure?",
  "Describe a time you worked in a team.", "What makes you unique?",
  "How do you handle criticism?", "Are you willing to relocate?",
  "What are your salary expectations?", "What are your hobbies?",
  "What is your leadership style?"
];

const technicalQuestions = [
  "What is the difference between a class and an object?", "What is polymorphism in OOP?",
  "What is inheritance?", "What is encapsulation?", "What is abstraction?",
  "Difference between interface and abstract class?", "What are constructors and destructors?",
  "What is the difference between stack and heap memory?", "What is the use of the 'static' keyword?",
  "What is exception handling?", "What is recursion?", "What is a pointer?",
  "Call by value vs Call by reference?", "What is multithreading?", "What is a deadlock?",
  "Procedural vs OOP?", "What are access specifiers?", "What is a virtual function?",
  "What are design patterns?", "Explain SOLID principles."
];

const jsQuestions = [
  "What is a closure in JavaScript?", "Difference between let, var, and const?",
  "What is hoisting?", "What is the event loop?", "Explain promises and async/await.",
  "What are arrow functions?", "What is the DOM?", "What is a callback function?",
  "What are template literals?", "What is destructuring?", "Spread and rest operators?",
  "Difference between == and ===?", "What are higher-order functions?", "What is a prototype?",
  "Explain event delegation.", "localStorage vs sessionStorage?", "JavaScript data types?",
  "What is NaN?", "What is JSON?", "What are JS modules?"
];

const pythonQuestions = [
  "What are Python lists and tuples?", "Difference between is and ==?", "What is a lambda function?",
  "What is list comprehension?", "What is the use of 'self'?", "Deep copy vs shallow copy?",
  "What are decorators?", "Difference between pass, continue, break?", "What is a generator?",
  "What is a dictionary?", "Difference between module and package?", "Explain memory management in Python.",
  "What is pickling?", "What is `__init__`?", "What is virtual environment?", "What is PEP 8?",
  "What is GIL?", "What is *args and **kwargs?", "What are exceptions?", "Python data types?"
];

const dsaQuestions = [
  "What is an array?", "What is a linked list?", "Difference between stack and queue?",
  "What is a binary tree?", "What is a binary search tree?", "Difference between DFS and BFS?",
  "What is recursion?", "Time complexity of binary search?", "Explain quicksort.",
  "What is merge sort?", "What is dynamic programming?", "What is memoization?",
  "What is a hash table?", "Linear vs binary search?", "What is a graph?",
  "Explain Dijkstra’s algorithm.", "What is a heap?", "What is a priority queue?",
  "What are greedy algorithms?", "Types of sorting algorithms?"
];

let questions = [];
let currentIndex = 0;
let timeLeft = 60;
let timerInterval;

const questionElement = document.getElementById("question");
const timerElement = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const scoreBox = document.getElementById("score-box");
const categorySelect = document.getElementById("category");

function loadQuestions(category) {
  switch (category) {
    case "hr": return hrQuestions;
    case "technical": return technicalQuestions;
    case "javascript": return jsQuestions;
    case "python": return pythonQuestions;
    case "dsa": return dsaQuestions;
    default: return [];
  }
}

function loadNextQuestion() {
  if (currentIndex >= questions.length) {
    questionElement.textContent = "Interview complete. Well done!";
    timerElement.style.display = "none";
    scoreBox.style.display = "none";
    startBtn.textContent = "Restart";
    startBtn.style.display = "block";
    return;
  }

  questionElement.textContent = questions[currentIndex];
  document.getElementById("answered-well").checked = false;
  document.getElementById("need-improvement").checked = false;
  scoreBox.style.display = "block";

  timeLeft = 60;
  timerElement.textContent = timeLeft;
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      currentIndex++;
      loadNextQuestion();
    }
  }, 1000);
}

startBtn.addEventListener("click", () => {
  const selectedCategory = categorySelect.value;
  questions = loadQuestions(selectedCategory);
  currentIndex = 0;
  timerElement.style.display = "block";
  startBtn.style.display = "none";
  loadNextQuestion();
});
