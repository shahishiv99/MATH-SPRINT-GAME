const radioContainers = document.querySelectorAll(".radio-container");
const startForm = document.getElementById("start-form");
const radioInputs = document.querySelectorAll("input");
const countDownPage = document.getElementById("countdown-page");
const splashPage = document.getElementById("splash-page");
const countDown = document.querySelector(".countdown");
const gamePage = document.getElementById("game-page");
const itemContainer = document.querySelector(".item-container");
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const scorePage = document.getElementById("score-page");
const playAgainBtn = document.querySelector(".play-again");
const bestScores = document.querySelectorAll(".best-score-value");

let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];
// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Refresh Best Score
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Check Local Storage for Best Score, Set bestScoreArray

function getSaveBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 20, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Update Best Score
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select Correct Best Score to update
    if (questionAmount == score.questions) {
      // Return Best Best Score
      const saveBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (saveBestScore === 0 || saveBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash page
  bestScoresToDOM();
  // Save to local Storage
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
}

// Reset The Game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Score Show to DOM

function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Display Time in DOM
function scoreToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);

  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll To up
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

// Stop timer, Process go to Score Page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log(playerGuessArray);
    clearInterval(timer);
    // Check wrong guesses, add Penalty time
    equationsArray.forEach((data, i) => {
      if (data.evaluated === playerGuessArray[i]) {
        // Correct guess, No penalty
      } else {
        // Incorrect guess, Add Penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoreToDOM();
  }
}

// every second to time Played
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Scroll
let valueY = 0;

// Start Timer when game page clicked
function startTimer() {
  // Reset Time
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

function select(guess) {
  // scroll 80px
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Push the value of player selected
  return guess ? playerGuessArray.push("true") : playerGuessArray.push("false");
}

// Get Random Number
function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}

// Correct / Incorrect Equations
function createEquations() {
  const correctEquations = getRandomNum(questionAmount);
  const incorrectEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNum(9);
    secondNumber = getRandomNum(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = {
      value: equation,
      evaluated: "true",
    };
    equationsArray.push(equationObject);
  }

  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < incorrectEquations; i++) {
    firstNumber = getRandomNum(9);
    secondNumber = getRandomNum(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 2} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 4} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomNum(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }

  shuffle(equationsArray);
}

// Create DOM Equations
function createDOMEquations() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // Append child
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  createDOMEquations();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Display 3, 2, 1 Go!
function countDownStart() {
  countDown.textContent = "3";
  setTimeout(() => {
    countDown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countDown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countDown.textContent = "Go!";
  }, 3000);
  setTimeout(() => {
    gamePage.hidden = false;
    countDownPage.hidden = true;
  }, 4000);
}
// Navigate from Splash page to countDown Page
function showCountdown() {
  countDownPage.hidden = false;
  splashPage.hidden = true;
  countDownStart();
  populateGamePage();
}
// Get the value from Selected radio value
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Select Form that decides amount of Questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove("selected-label");
    // Add Selected Label if Radio Checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);
playAgainBtn.addEventListener("click", playAgain);

// Check Set/Get Best Scores
getSaveBestScores();
updateBestScore();
