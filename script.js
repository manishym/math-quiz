// Configuration
const TOTAL_QUESTIONS = 50; // Total number of questions
const PERCENT_YES_ANSWERS = 55; // Percentage of "Yes" answers
TIME_PER_QUESTION = 30; // Time per question in seconds

// Derived configuration
const TOTAL_YES_QUESTIONS = Math.floor((TOTAL_QUESTIONS * PERCENT_YES_ANSWERS) / 100);
const TOTAL_NO_QUESTIONS = TOTAL_QUESTIONS - TOTAL_YES_QUESTIONS;

const timerElement = document.getElementById("timer");
const questionElement = document.getElementById("question");
const questionNumberElement = document.getElementById("question-number");
const feedbackElement = document.getElementById("feedback");
const currentScoreElement = document.getElementById("current-score");
const answeredQuestionsElement = document.getElementById("answered-questions");
const startButton = document.getElementById("start-btn");
const yesButton = document.getElementById("yes-btn");
const noButton = document.getElementById("no-btn");
const resultElement = document.getElementById("result");
const finalScoreElement = document.getElementById("final-score");
const progressChartCanvas = document.getElementById("progress-chart");

const divisors = [3, 4, 5, 6, 8, 9, 11];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = 0;
let timer;
let timeLeft = TIME_PER_QUESTION * TOTAL_QUESTIONS; // Total time in seconds

// Chart.js Progress Pie Chart
let progressChart;
function initializeChart() {
  progressChart = new Chart(progressChartCanvas, {
    type: "pie",
    data: {
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          data: [0, TOTAL_QUESTIONS],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  });
}

// Update Chart
function updateChart() {
  const completed = currentQuestionIndex;
  const remaining = questions.length - completed;
  progressChart.data.datasets[0].data = [completed, remaining];
  progressChart.update();
}

// Generate questions based on configuration
function generateQuestions() {
  const yesQuestions = [];
  const noQuestions = [];

  // Generate "Yes" questions
  for (let i = 0; i < TOTAL_YES_QUESTIONS; i++) {
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    const number = divisor * Math.floor(Math.random() * 100 + 1);
    yesQuestions.push({ number, divisor, isDivisible: true });
  }

  // Generate "No" questions
  for (let i = 0; i < TOTAL_NO_QUESTIONS; i++) {
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    let number;
    do {
      number = Math.floor(Math.random() * 1000) + 1;
    } while (number % divisor === 0); // Ensure it is NOT divisible
    noQuestions.push({ number, divisor, isDivisible: false });
  }

  questions = [...yesQuestions, ...noQuestions];
  questions.sort(() => Math.random() - 0.5); // Shuffle questions
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    timerElement.textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

// Load Next Question
function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  const question = questions[currentQuestionIndex];
  questionElement.textContent = `Is ${question.number} divisible by ${question.divisor}?`;
  questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
  feedbackElement.style.display = "none";
  updateChart();
}

// Handle Answer
function handleAnswer(isYes) {
  const question = questions[currentQuestionIndex];
  const isCorrect = isYes === question.isDivisible;

  if (isCorrect) {
    score++;
    feedbackElement.textContent = "Correct!";
    feedbackElement.style.color = "green";
  } else {
    feedbackElement.textContent = "Wrong!";
    feedbackElement.style.color = "red";
  }

  feedbackElement.style.display = "block";
  answeredQuestions++;
  currentQuestionIndex++;

  // Update Scoreboard
  currentScoreElement.textContent = score;
  answeredQuestionsElement.textContent = answeredQuestions;

  setTimeout(loadQuestion, 1000);
}

// End Quiz
function endQuiz() {
  clearInterval(timer);
  document.getElementById("quiz").style.display = "none";
  resultElement.style.display = "block";
  finalScoreElement.textContent = `Your Score: ${score} / ${answeredQuestions}`;
}

// Event Listeners
startButton.addEventListener("click", () => {
  generateQuestions();
  initializeChart();
  startTimer();
  loadQuestion();

  startButton.disabled = true;
  yesButton.disabled = false;
  noButton.disabled = false;
});
timerElement.textContent = `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;
yesButton.addEventListener("click", () => handleAnswer(true));
noButton.addEventListener("click", () => handleAnswer(false));

 