// Configuration
const CONFIG = {
  divisibility: {
    totalQuestions: 15, // Total number of questions
    percentYes: 40, // Percentage of "Yes" answers
  },
  fractions: {
    totalQuestions: 10, // Total number of fraction questions
  },
  primeFactors: {
    totalQuestions: 10, // Total number of prime factor questions
  },
};

// Quiz Types
const QUIZ_TYPES = {
  divisibility: {
    title: "Divisibility Test",
    generateQuestions: generateDivisibilityQuestions,
    config: CONFIG.divisibility,
  },
  fractions: {
    title: "Operations on Fractions",
    generateQuestions: generateFractionQuestions,
    config: CONFIG.fractions,
  },
  primeFactors: {
    title: "Finding Prime Factors",
    generateQuestions: generatePrimeFactorQuestions,
    config: CONFIG.primeFactors,
  },
};

// Current Quiz Context
let currentQuiz = null;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Start Quiz Menu
function startQuiz(type) {
  currentQuiz = QUIZ_TYPES[type];
  document.querySelector(".menu").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("quiz-title").innerText = currentQuiz.title;
}

// Generate Divisibility Test Questions
function generateDivisibilityQuestions() {
  const divisors = [2, 3, 5, 7, 11];
  const totalQuestions = currentQuiz.config.totalQuestions;
  const totalYesQuestions = Math.floor((totalQuestions * currentQuiz.config.percentYes) / 100);
  const totalNoQuestions = totalQuestions - totalYesQuestions;

  const yesQuestions = Array.from({ length: totalYesQuestions }, () => {
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    const number = divisor * Math.floor(Math.random() * 10 + 1); // Always divisible
    return {
      question: `Is ${number} divisible by ${divisor}?`,
      options: ["Yes", "No"],
      answer: "Yes",
    };
  });

  const noQuestions = Array.from({ length: totalNoQuestions }, () => {
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    let number;
    do {
      number = Math.floor(Math.random() * 100) + 1;
    } while (number % divisor === 0); // Ensure not divisible
    return {
      question: `Is ${number} divisible by ${divisor}?`,
      options: ["Yes", "No"],
      answer: "No",
    };
  });

  questions = [...yesQuestions, ...noQuestions];
  questions.sort(() => Math.random() - 0.5); // Shuffle questions
}

// Generate Fraction Operations Questions
function generateFractionQuestions() {
  const totalQuestions = currentQuiz.config.totalQuestions;
  const operations = ["add", "subtract", "multiply", "divide"];
  questions = Array.from({ length: totalQuestions }, () => {
    const op = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const den1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const den2 = Math.floor(Math.random() * 10) + 1;

    let question, correctAnswer;
    switch (op) {
      case "add":
        question = `What is (${num1}/${den1}) + (${num2}/${den2})?`;
        correctAnswer = `${num1 * den2 + num2 * den1}/${den1 * den2}`;
        break;
      case "subtract":
        question = `What is (${num1}/${den1}) - (${num2}/${den2})?`;
        correctAnswer = `${num1 * den2 - num2 * den1}/${den1 * den2}`;
        break;
      case "multiply":
        question = `What is (${num1}/${den1}) * (${num2}/${den2})?`;
        correctAnswer = `${num1 * num2}/${den1 * den2}`;
        break;
      case "divide":
        question = `What is (${num1}/${den1}) ÷ (${num2}/${den2})?`;
        correctAnswer = `${num1 * den2}/${den1 * num2}`;
        break;
    }

    const options = generateMultipleChoice(correctAnswer);
    return { question, options, answer: correctAnswer };
  });
}

// Generate Prime Factor Questions
function generatePrimeFactorQuestions() {
  const totalQuestions = currentQuiz.config.totalQuestions;
  questions = Array.from({ length: totalQuestions }, () => {
    const number = Math.floor(Math.random() * 100) + 2;
    const correctAnswer = primeFactors(number).join(", ");
    const options = generateMultipleChoice(correctAnswer);
    return {
      question: `What are the prime factors of ${number}?`,
      options,
      answer: correctAnswer,
    };
  });
}

// Prime Factors Helper
function primeFactors(n) {
  const factors = [];
  let divisor = 2;
  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

// Generate Multiple-Choice Options
function generateMultipleChoice(correctAnswer) {
  const options = new Set();
  options.add(correctAnswer);

  while (options.size < 4) {
    const randomAnswer = Math.floor(Math.random() * 100 + 1).toString();
    options.add(randomAnswer);
  }

  return Array.from(options).sort(() => Math.random() - 0.5); // Shuffle
}

// Start the Quiz Session
function startQuizSession() {
  currentQuiz.generateQuestions();
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("start-btn").style.display = "none";
  loadQuestion();
}

// Load a Question
function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").innerText = questionObj.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = ""; // Clear previous options

  questionObj.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.innerText = option;
    button.onclick = () => handleAnswer(option);
    optionsContainer.appendChild(button);
  });
}

// Handle Answer
function handleAnswer(selectedAnswer) {
  const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;

  if (isCorrect) {
    score++;
    document.getElementById("feedback").innerText = "Correct!";
    document.getElementById("feedback").style.color = "green";
  } else {
    document.getElementById("feedback").innerText = "Wrong!";
    document.getElementById("feedback").style.color = "red";
  }

  document.getElementById("feedback").style.display = "block";
  currentQuestionIndex++;

  setTimeout(loadQuestion, 1000);
}

// End Quiz
function endQuiz() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("final-score").innerText = `Your Score: ${score} / ${questions.length}`;
}

// Reload Menu
function reloadMenu() {
  document.getElementById("quiz-container").style.display = "none";
  document.querySelector(".menu").style.display = "block";
}
