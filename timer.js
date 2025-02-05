const timerElement = document.getElementById("timer");
// Timer
function startTimer() {
    const timerBar = document.getElementById('timer-progress');
    const total_time = timePerQuestion * numQuestions;
    timer = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const seconds = (timeLeft % 60).toString().padStart(2, "0");
      timerElement.textContent = `${minutes}:${seconds}`;
  
      if (timeLeft <= 0) {
        endQuiz();
      }
      timerBar.style.width = `${(timeLeft / total_time) * 100}%`;
    }, 1000);
  }