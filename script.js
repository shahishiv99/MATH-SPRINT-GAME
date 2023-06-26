const radioContainers = document.querySelectorAll(".radio-container");
const startForm = document.getElementById("start-form");
const radioInputs = document.querySelectorAll("input");
const countDownPage = document.getElementById("countdown-page");
const splashPage = document.getElementById("splash-page");
const countDown = document.querySelector(".countdown");
const gamePage = document.getElementById("game-page");
const itemContainer = document.querySelector(".item-container");

let questionAmount = 0;
let equationsArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

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
  }, 3800);
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
