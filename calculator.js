/* 
 * Calculator Application 
 * Based on the following Odin Project Assignment: 
 * https://www.theodinproject.com/lessons/foundations-calculator
 * 
 * Responsive calculator application which allows the user to Add, Subtract, Multiply and Divide.
 * Features include: 
 * Responsive
 * Error handling for erroneous operations 
 * 
 */

let calculation = "";
let previousCalculation = null;
let previousResult = null;
let dividedByZero = false;

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

function appendToCalculation(value) {
    // Don't allow starting calculation with an operator
    if (calculation === "" && isOperator(value)) {
        return false;
    }
    // Don't allow repeating operators
    // Instead, overwrite last operator
    let calculationArray = calculation.trim().split(" ");
    let calcArrayLastItem = calculationArray.at(calculationArray.length - 1);
    if (isOperator(calcArrayLastItem) && isOperator(value)) {
        let lastOperator = calculation.lastIndexOf(calcArrayLastItem);
        calculation = calculation.substring(0, lastOperator) + `${value} `;
        return true;
    }
    if (previousResult === null) {
        if (isOperator(value)) {
            calculation += ` ${value} `;
        } else if (isNumber(value)) {
            calculation += value;
        }
    } else {
        if (isOperator(value)) {
            calculation = `${previousResult} ${value} `;
        } else if (isNumber(value)) {
            calculation = `${value}`;
        }
        previousResult = null;
    }
    return true;
}

function calculate() {
    let calculationArray = calculation.trim().split(" ");

    if (!isValidCalculation(calculationArray)) {
        calculation = "";
        return "ERROR";
    }

    let currentOperator = null;
    let rightNumber = null;
    let sum = null;

    for(let i = 0; i < calculationArray.length; i++) {
        let value = calculationArray[i];
        if(isOperator(value)) {
            currentOperator = value;
        } else if (isNumber(value)) {
            if (sum === null) {
                sum = value;
            } else {
                rightNumber = value;
            }
        }
        if (currentOperator !== null &&
            sum !== null && 
            rightNumber !== null) {
                
                sum = operate(currentOperator, 
                              parseInt(sum), 
                              parseInt(rightNumber));
                if (sum === Infinity || !isNumber(sum)) {
                    calculation = "";
                    dividedByZero = true;
                    return "Cannot Divide by Zero";
                }
                currentOperator, rightNumber = null;
            }
    }
    // If value has remainder show to 3 decimal place.
    if (sum % 1 !== 0) {
        sum = parseFloat(sum).toFixed(3);
    }
    previousResult = sum;
    previousCalculation = calculation;
    calculation = `${sum} `;
    return sum;
}

function writeToDisplay(value) {
    let displayElement = document.querySelector("#calculation-display");
    let displayText;
    displayElement.style.fontSize = "";
    if (value === "=") {
        let calculationResult = calculate();
        if (calculationResult === "ERROR") {
            displayText = calculationResult;
        } else if (dividedByZero) {
            displayText = calculationResult;
            dividedByZero = false;
        }
        else {
            displayText = `${calculationResult}`;
        }
    } else if (value === "clear") {
        calculation = ""; 
        displayText = "0";
        previousResult = null;
    } else if ((isOperator(value) || isNumber(value)) && 
                appendToCalculation(value)) {
        displayText = calculation;
    }
    displayElement.textContent = displayText;
    checkAndSetDisplayFontSize(displayElement);
}

function checkAndSetDisplayFontSize() {
    let displayElement = document.querySelector("#calculation-display");
    while (displayOverflowsContainer(displayElement)) {
        shrinkDisplayFontSize(displayElement);
    }
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

function displayOverflowsContainer(displayElement) {
    let displayTextWidth = displayElement.clientWidth;
    let displayContainerWidth = displayElement.parentElement.clientWidth;
    let doesTextOverflowsContainer = displayTextWidth > displayContainerWidth;
    if (displayElement.style.fontSize === "10%") {
        return false;
    }
    else if (doesTextOverflowsContainer) {
        return true;
    } else {
        return false
    }
}

function isValidCalculation(calculationArray) {
    // Calculation is not empty
    if (calculationArray.at(0) === "") {
        return false;
    }
    // Calculation does not end with an operator
    if (isOperator(calculationArray.at(calculationArray.length - 1))) {
        return false;
    }
    // Calculation contains an operator 
    if (!calculationArray.some(value => {return isOperator(value)})) {
        return false;
    }
    return true;
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
            .addEventListener("click", () => writeToDisplay(1));
    document.querySelector("#number-two")
            .addEventListener("click", () => writeToDisplay(2));
    document.querySelector("#number-three")
            .addEventListener("click", () => writeToDisplay(3));
    document.querySelector("#number-four")
            .addEventListener("click", () => writeToDisplay(4));
    document.querySelector("#number-five")
            .addEventListener("click", () => writeToDisplay(5));
    document.querySelector("#number-six")
            .addEventListener("click", () => writeToDisplay(6));
    document.querySelector("#number-seven")
            .addEventListener("click", () => writeToDisplay(7));
    document.querySelector("#number-eight")
            .addEventListener("click", () => writeToDisplay(8));
    document.querySelector("#number-nine")
            .addEventListener("click", () => writeToDisplay(9));
    document.querySelector("#number-zero")
            .addEventListener("click", () => writeToDisplay(0));
    // Equals + Clear
    document.querySelector("#equals")
            .addEventListener("click", () => writeToDisplay("="));
    document.querySelector("#clear")
            .addEventListener("click", () => writeToDisplay("clear"));
}

window.onresize = checkAndSetDisplayFontSize;

function initialize() {
    addCalculatorEvents();
}

initialize();