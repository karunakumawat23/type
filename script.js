// Variables
let timerInterval;
let timeLeft;
let charactersTyped = 0;
let totalCharacters = 0;
let selectedLevel = "easy"; // Default level

// Elements
const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const timer = document.getElementById("timer");
const wpm = document.getElementById("wpm");
const accuracy = document.getElementById("accuracy");
const progressBar = document.getElementById("progress-bar");
const levelButtons = document.querySelectorAll(".level");
const startTypingButton = document.getElementById("startTyping");
const submitResultsButton = document.getElementById("submitResults");
const retryTestButton = document.getElementById("retryTest");
const returnToLevelsButton = document.getElementById("returnToLevels");
const results = document.getElementById("results");
const typingTest = document.getElementById("typing-test");
const levelSelection = document.getElementById("level-selection");
const finalWPM = document.getElementById("final-wpm");
const finalAccuracy = document.getElementById("final-accuracy");
const correctPercentage = document.getElementById("correct-percentage");
const errorPercentage = document.getElementById("error-percentage");
const darkModeToggle = document.getElementById("darkModeToggle");
const backButton = document.getElementById("backButton");

// Texts for Levels
const texts = {
  easy: "The quick brown fox jumps over the lazy dog.",
  medium: "Typing tests can help you improve your speed and accuracy.",
  hard: "A journey of a thousand miles begins with a single step.",
};

// Timer Durations for Levels
const levelDurations = {
  easy: 180, // 3 minutes
  medium: 120, // 2 minutes
  hard: 60, // 1 minute
};

// Level Selection
levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedLevel = button.dataset.level; // Get the selected level
    textDisplay.textContent = texts[selectedLevel];
    totalCharacters = texts[selectedLevel].length;

    // Set the timer duration based on the selected level
    timeLeft = levelDurations[selectedLevel];
    timer.textContent = formatTime(timeLeft);

    levelSelection.classList.add("hidden");
    typingTest.classList.remove("hidden");
    startTypingButton.classList.remove("hidden");
    submitResultsButton.classList.add("hidden");
  });
});

// Start Typing
startTypingButton.addEventListener("click", () => {
  textInput.disabled = false; // Enable typing
  textInput.focus(); // Focus on the input area
  startTypingButton.classList.add("hidden");
  submitResultsButton.classList.remove("hidden");
  progressBar.querySelector("span").style.width = "0%"; // Reset progress bar
  startTimer(); // Start timer
});

// Timer Function
function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = formatTime(timeLeft);
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      endTest();
    }
  }, 1000);
}

// Typing Stats and Progress
textInput.addEventListener("input", () => {
  const typedText = textInput.value;
  charactersTyped = typedText.length;

  // Calculate correct characters
  const correctChars = typedText
    .split("")
    .filter((char, index) => char === texts[selectedLevel][index]).length;
  const errors = charactersTyped - correctChars;

  // Update Progress Bar
  const progressPercentage = (charactersTyped / totalCharacters) * 100;
  progressBar.querySelector("span").style.width = `${progressPercentage}%`;

  // Update WPM and Accuracy
  const elapsedTime = levelDurations[selectedLevel] - timeLeft;
  const currentWPM = elapsedTime > 0 ? Math.floor((charactersTyped / 5) / (elapsedTime / 60)) : 0;
  wpm.textContent = `WPM: ${currentWPM}`;
  const currentAccuracy =
    charactersTyped > 0 ? ((correctChars / charactersTyped) * 100).toFixed(2) : 100;
  accuracy.textContent = `Accuracy: ${currentAccuracy}%`;
});

// End Test
function endTest() {
  textInput.disabled = true;
  clearInterval(timerInterval);
}

// Submit Results
submitResultsButton.addEventListener("click", () => {
  const typedText = textInput.value;
  const correctChars = typedText
    .split("")
    .filter((char, index) => char === texts[selectedLevel][index]).length;

  const correctPercent = ((correctChars / totalCharacters) * 100).toFixed(2);
  const errorPercent = (100 - correctPercent).toFixed(2);

  finalWPM.textContent = wpm.textContent;
  finalAccuracy.textContent = accuracy.textContent;
  correctPercentage.textContent = `${correctPercent}%`;
  errorPercentage.textContent = `${errorPercent}%`;

  typingTest.classList.add("hidden");
  results.classList.remove("hidden");
});

// Retry Test
retryTestButton.addEventListener("click", () => {
  resetTest();
  typingTest.classList.remove("hidden");
  results.classList.add("hidden");
});

// Return to Levels
returnToLevelsButton.addEventListener("click", () => {
  resetTest();
  levelSelection.classList.remove("hidden");
  results.classList.add("hidden");
});

// Reset Test
function resetTest() {
  textInput.value = ""; // Clear text input
  progressBar.querySelector("span").style.width = "0%"; // Reset progress bar
  timer.textContent = `0:00`; // Reset timer
  wpm.textContent = "WPM: 0"; // Reset WPM
  accuracy.textContent = "Accuracy: 100%"; // Reset accuracy
  clearInterval(timerInterval); // Stop any existing timer
  textInput.disabled = true; // Disable typing area
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Back Button
backButton.addEventListener("click", () => {
  resetTest();
  typingTest.classList.add("hidden");
  levelSelection.classList.remove("hidden");
});

// Format Time for Timer Display
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
