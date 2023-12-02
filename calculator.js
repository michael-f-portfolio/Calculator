/* 
 * Calculator Application 
 * Based on the following Odin Project Assignment: 
 * https://www.theodinproject.com/lessons/foundations-calculator
 * 
 * Responsive calculator application which allows the user to Add, Subtract, Multiply and Divide.
 * Features include: 
 * Responsiveness
 * Error handling for erroneous operations 
 * 
 * 
 * TODO:
 * Bug: text doesn't get bigger if it's been shrunk
 */
const DECIMAL_MAX_LENGTH = 9;
const RESULT_MAX_LENGTH = 21;

// Short Calc Variables
let leftValue = null;
let operator = null;
let rightValue = null;

// Other Variables
let dividedByZero = false;
let appendToValue = false;


function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function operate(operator, num1, num2) {
    let result;
    if (operator === "+") {
        result = add(num1, num2);
    }
    if (operator === "-") {
        result = subtract(num1, num2);
    }
    if (operator === "*") {
        result = multiply(num1, num2);
    }
    if (operator === "/") {
        result = divide(num1, num2);
    }
    return result;
}

function resetCalculator() {
    leftValue = null;
    operator = null;
    rightValue = null;
    appendToValue = false;
    return "0";
}

function calculate() {
    let result = operate(operator, parseFloat(leftValue), parseFloat(rightValue));
    if (result % 1 !== 0) {
        result = result.toFixed(DECIMAL_MAX_LENGTH);
    }
    return result;
}

function writeToDisplay(value) {
    let inputDisplay = document.querySelector("#input-display");
    let inputDisplayText = inputDisplay.textContent;
    let result;
    try {
        if (value === "=" && leftValue !== null && 
            operator !== null && rightValue !== null) {
            result = calculate();
            leftValue = `${result}`;
            rightValue = null;
            operator = null;
            appendToValue = false;
            inputDisplayText = result;
        } else if (value === "clear") {
            inputDisplayText = resetCalculator();
        } else if (isOperator(value)) {
            if (leftValue !== null && rightValue != null) {
                result = calculate();
                leftValue = `${result}`;
                rightValue = null;
                operator = value;
                inputDisplayText = `${result} ${value} `;
            } else if (leftValue !== null) {
                operator = `${value}`;
                inputDisplayText = `${leftValue} ${operator} `;
            } 
        } else if (isNumber(value)) {
            if (operator === null) {
                if (appendToValue) {
                    leftValue = `${leftValue}${value}`
                } else {
                    leftValue = value;
                    appendToValue = true;
                }
                inputDisplayText = leftValue;
            } else {
                if (rightValue === null) {
                    rightValue = value;
                } else {
                    rightValue = `${rightValue}${value}`;
                }
                inputDisplayText = `${leftValue} ${operator} ${rightValue}`;
            }
        }
    } catch (e) {
        inputDisplayText = resetCalculator();
    }
    inputDisplay.textContent = inputDisplayText;
    checkAndSetDisplayFontSize();
}

function checkAndSetDisplayFontSize() {
    let inputDisplay = document.querySelector("#input-display");
    while (displayOverflowsContainer(inputDisplay)) {
        shrinkDisplayFontSize(inputDisplay);
    }
}

function displayOverflowsContainer(displayElement) {
    let displayTextWidth = displayElement.clientWidth;
    let displayContainerWidth = displayElement.parentElement.clientWidth;
    if (displayElement.style.fontSize === "10%") {
        return false;
    }
    return displayTextWidth > displayContainerWidth;
}

function shrinkDisplayFontSize(displayElement) {
    let currentFontSize = displayElement.style.fontSize; 
    if (currentFontSize === "") {
        displayElement.style.fontSize = "90%";
    } else if (currentFontSize === "90%") {
        displayElement.style.fontSize = "80%";
    } else if (currentFontSize === "80%") {
        displayElement.style.fontSize = "70%";
    } else if (currentFontSize === "70%") {
        displayElement.style.fontSize = "60%";
    } else if (currentFontSize === "60%") {
        displayElement.style.fontSize = "50%";
    } else if (currentFontSize === "50%") {
        displayElement.style.fontSize = "40%";
    } else if (currentFontSize === "40%") {
        displayElement.style.fontSize = "30%";
    } else if (currentFontSize === "30%") {
        displayElement.style.fontSize = "20%";
    } else if (currentFontSize === "20%") {
        displayElement.style.fontSize = "10%";
    }   
}

function isOperator(value) {
    return value === "+" || 
           value === "-" || 
           value === "/" || 
           value === "*";
}

function isNumber(value) {
    return !isNaN(value);
}

function addCalculatorEvents() {
    // Operators
    document.querySelector("#add-operator")
            .addEventListener("click", () => writeToDisplay("+"));
    document.querySelector("#subtract-operator")
            .addEventListener("click", () => writeToDisplay("-"));
    document.querySelector("#multiply-operator")
            .addEventListener("click", () => writeToDisplay("*"));
    document.querySelector("#divide-operator")
            .addEventListener("click", () => writeToDisplay("/"));
    // Numbers
    document.querySelector("#number-one")
            .addEventListener("click", () => writeToDisplay("1"));
    document.querySelector("#number-two")
            .addEventListener("click", () => writeToDisplay("2"));
    document.querySelector("#number-three")
            .addEventListener("click", () => writeToDisplay("3"));
    document.querySelector("#number-four")
            .addEventListener("click", () => writeToDisplay("4"));
    document.querySelector("#number-five")
            .addEventListener("click", () => writeToDisplay("5"));
    document.querySelector("#number-six")
            .addEventListener("click", () => writeToDisplay("6"));
    document.querySelector("#number-seven")
            .addEventListener("click", () => writeToDisplay("7"));
    document.querySelector("#number-eight")
            .addEventListener("click", () => writeToDisplay("8"));
    document.querySelector("#number-nine")
            .addEventListener("click", () => writeToDisplay("9"));
    document.querySelector("#number-zero")
            .addEventListener("click", () => writeToDisplay("0"));
    // Equals + Clear
    document.querySelector("#equals")
            .addEventListener("click", () => writeToDisplay("="));
    document.querySelector("#clear")
            .addEventListener("click", () => writeToDisplay("clear"));
}

function initialize() {
    addCalculatorEvents();
    window.onresize = checkAndSetDisplayFontSize;

}

initialize();