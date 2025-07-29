const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "HyperText Markup Language", correct: true },
      { text: "HighText Machine Language", correct: false },
      { text: "HyperTransfer Markup Language", correct: false },
      { text: "None of the above", correct: false },
    ],
  },
  {
    question: "Which language is used for styling web pages?",
    answers: [
      { text: "HTML", correct: false },
      { text: "JQuery", correct: false },
      { text: "CSS", correct: true },
      { text: "XML", correct: false },
    ],
  },
  {
    question: "What does JS stand for?",
    answers: [
      { text: "Java Source", correct: false },
      { text: "JavaScript", correct: true },
      { text: "Just Script", correct: false },
      { text: "Jolly Script", correct: false },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const timerElement = document.getElementById("time-remaining");
const progressBar = document.getElementById("progress");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  scoreContainer.innerHTML = "";
  showQuestion();
}

function showQuestion() {
  resetState();
  startTimer();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(button, answer.correct));
    answerButtons.appendChild(button);
  });
}

function resetState() {
  clearInterval(timerInterval);
  timeLeft = 15;
  timerElement.textContent = timeLeft;
  progressBar.style.width = "100%";
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

function selectAnswer(selectedButton, isCorrect) {
  clearInterval(timerInterval);

  if (isCorrect) {
    selectedButton.classList.add("correct");
    score++;
  } else {
    selectedButton.classList.add("wrong");
  }

  Array.from(answerButtons.children).forEach((button) => {
    button.disabled = true;
    if (
      button.innerText ===
      questions[currentQuestionIndex].answers.find((a) => a.correct).text
    ) {
      button.classList.add("correct");
    }
  });

  nextButton.style.display = "inline-block";
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    progressBar.style.width = `${(timeLeft / 15) * 100}%`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoFailQuestion();
    }
  }, 1000);
}

function autoFailQuestion() {
  const correctAnswer = questions[currentQuestionIndex].answers.find((a) => a.correct).text;

  Array.from(answerButtons.children).forEach((button) => {
    button.disabled = true;
    if (button.innerText === correctAnswer) {
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
    }
  });

  nextButton.style.display = "inline-block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  resetState();
  questionElement.innerText = "Quiz Finished!";
  scoreContainer.innerText = `Your Score: ${score} / ${questions.length}`;
  nextButton.innerText = "Restart";
  nextButton.style.display = "inline-block";
  nextButton.addEventListener("click", startQuiz);
}

startQuiz();
