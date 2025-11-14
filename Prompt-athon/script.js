// script.js - Supports both images & videos dynamically

let questions = [];
let currentQuestion = 0;
let score = 0;

// DOM Elements
const mediaContainer = document.getElementById("media-container");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const scoreboard = document.getElementById("scoreboard");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const scoreDisplay = document.getElementById("score-display");
const progressBar = document.getElementById("progress-bar");
const gameEl = document.getElementById("game");

// Load and shuffle questions
async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    const data = await res.json();
    questions = data.sort(() => Math.random() - 0.5); // Shuffle
    currentQuestion = 0;
    score = 0;
    updateScoreDisplay();
    showQuestion();
  } catch (err) {
    console.error("Error loading questions:", err);
    mediaContainer.innerHTML = "<p style='color:#ff6666'>Failed to load questions.json</p>";
  }
}

// Show the current question
function showQuestion() {
  if (!questions || questions.length === 0) {
    mediaContainer.innerHTML = "<p style='color:#ff6666'>No questions found.</p>";
    return;
  }

  const q = questions[currentQuestion];

  // Reset UI
  mediaContainer.innerHTML = "";
  optionsContainer.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";

  // Render media
  if (q.type === "video") {
    const video = document.createElement("video");
    video.src = q.file;
    video.controls = true;
    video.autoplay = true;
    video.muted = true;      // Required for autoplay in many browsers
    video.playsInline = true;
    video.className = "question-media";
    video.addEventListener("error", () => {
      mediaContainer.innerHTML = "<p style='color:#ff6666'>Video not found</p>";
    });
    mediaContainer.appendChild(video);
    video.play().catch(() => {});
  } else {
    const img = document.createElement("img");
    img.src = q.file;
    img.alt = "Question Image";
    img.className = "question-media";
    img.addEventListener("error", () => {
      mediaContainer.innerHTML = "<p style='color:#ff6666'>Image not found</p>";
    });
    mediaContainer.appendChild(img);
  }

  // Render options
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";
    btn.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(btn);
  });

  updateProgressBar();
  updateScoreDisplay();
}

// Check answer
function checkAnswer(selectedIndex) {
  const q = questions[currentQuestion];
  const correctIndex = q.answer;

  Array.from(optionsContainer.children).forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIndex) btn.classList.add("correct");
    if (idx === selectedIndex && idx !== correctIndex) btn.classList.add("wrong");
  });

  feedback.textContent = selectedIndex === correctIndex ? "🎉 Correct!" : "❌ Wrong!";
  if (selectedIndex === correctIndex) score++;

  updateScoreDisplay();
  nextBtn.style.display = "inline-block";
}

// Move to next question
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showScoreboard();
  }
}

// End / scoreboard
function showScoreboard() {
  gameEl.classList.add("hidden");
  scoreboard.classList.remove("hidden");
  finalScore.textContent = `You scored ${score} out of ${questions.length}!`;
  progressBar.style.width = `100%`;
}

// Restart game
function restartGame() {
  scoreboard.classList.add("hidden");
  gameEl.classList.remove("hidden");
  loadQuestions();
}

// Helpers
function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
}
function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// Event listeners
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartGame);

// Start game
loadQuestions();
