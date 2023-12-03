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
 * Implement Memory Store and Memory Clear functions which...
 *      Will store the current value in the input display by pressing "MS".
 *      Will input the stored value into input display by pressing "MR".
 *      "Clear" will not remove the stored value.
 * Implement "Square" function which will square the value in the input display.
 * Implement "Square Root" function which will take the square root of the value in the input display.
 * Implement "Modulus" function which will return the remainder of a division function.
 * Implement ability to use keyboard to input values.
 * Break up repetitive code blocks into their own functions DRY DRY DRY
 * BUGS:
 * Resizing the window while a large value is in either the input display or calculation display can cause 
 * the text to go out of bounds of it's container.
 */
// Constants
const DECIMAL_MAX_LENGTH = 16;
const RESULT_MAX_LENGTH = 21;
const inputNumberFormat = {
    maximumSignificantDigits: DECIMAL_MAX_LENGTH
}

// Calculation Variables
let leftValue = null;
let originalLeftValue = null;
let operator = null;
let rightValue = null;

// Other Variables
let appendToValue = false;
let hasResult = false;

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
    originalLeftValue = null;
    appendToValue = false;
    hasResult = false;
}

function calculate(operator, leftValue, rightValue) {
    let result = operate(operator, parseFloat(leftValue), parseFloat(rightValue))
    if (result === Infinity || !isNumber(result)) {
        throw "Cannot divide by zero";
    }
    hasResult = true;
    if (!`${result}`.includes(".")) {
        return result;
    } else {
        if (decimalIsAtMostDecimalMaxLength(`${result}`) ) {
            return result;
        } else {
            return parseFloat(result.toFixed(DECIMAL_MAX_LENGTH));
        }
    }
}

function writeToDisplay(value) {
    let inputDisplay = document.querySelector("#input-display");
    let inputDisplayText = inputDisplay.textContent;
    let newInputDisplayText = inputDisplayText;
    let calculationDisplay = document.querySelector("#calculation-display");
    let calculationDisplayText = calculationDisplay.textContent;
    let newCalculationDisplayText = calculationDisplayText;
    let result;
    try {
        if (value === "equals" && leftValue !== null && operator !== null ) {
            if (rightValue !== null) {
                result = calculate(operator, parseFloat(leftValue), parseFloat(rightValue));
                newCalculationDisplayText = `${leftValue} ${operator} ${rightValue} =`;
            } else {
                if (originalLeftValue === null) {
                    originalLeftValue = leftValue;
                }
                result = calculate(operator, parseFloat(leftValue), parseFloat(originalLeftValue));
                newCalculationDisplayText = `${leftValue} ${operator} ${originalLeftValue} =`;
            }
            if (`${result}`.includes("e")) {
                newInputDisplayText = `${result}`;
            } else {
                newInputDisplayText = result.toLocaleString("en-US", inputNumberFormat);
            }
            leftValue = `${result}`;
            appendToValue = false;
        } else if (value === "remove-last-digit") {
            if (rightValue === null && leftValue !== null) {
                leftValue = leftValue.slice(0, leftValue.length -1);
                if (leftValue.includes(".")) {
                    let intValue = leftValue.split(".").at(0);
                    let decimalValue = leftValue.split(".").at(1);
                    newInputDisplayText = `${parseFloat(intValue).toLocaleString("en-US", inputNumberFormat)}.${decimalValue}`;
                } else if (leftValue === "" || leftValue === "-") {
                    newInputDisplayText = "0";
                    leftValue = null;
                    appendToValue = false;
                 } else {
                    newInputDisplayText = parseFloat(leftValue).toLocaleString("en-US", inputNumberFormat);
                }
            } else if (rightValue !== null && !hasResult) {
                rightValue = rightValue.slice(0, rightValue.length -1);
                if (rightValue.includes(".")) {
                    let intValue = rightValue.split(".").at(0);
                    let decimalValue = rightValue.split(".").at(1);
                    newInputDisplayText = `${parseFloat(intValue).toLocaleString("en-US", inputNumberFormat)}.${decimalValue}`;
                } else if (rightValue === "" || rightValue === "-") {
                    newInputDisplayText = "0";
                    rightValue = "0";
                }else {
                    newInputDisplayText = parseFloat(rightValue).toLocaleString("en-US", inputNumberFormat);
                }
            }
        } else if (value === "clear") {
            resetCalculator();
            newInputDisplayText = "0";
            newCalculationDisplayText = ""; 
        } else if (value === "invert") {
            let valueToInvert;
            if ((leftValue !== null && operator === null) || 
                    (rightValue !== null && appendToValue === false) ||
                    originalLeftValue !== null) {
                valueToInvert = parseFloat(leftValue);
                leftValue = `${valueToInvert *= -1}`;
                newInputDisplayText = parseFloat(leftValue).toLocaleString("en-US", inputNumberFormat);
            } else if (rightValue !== null) {
                valueToInvert = parseFloat(rightValue); 
                rightValue = `${valueToInvert *= -1}`;
                newInputDisplayText = parseFloat(rightValue).toLocaleString("en-US", inputNumberFormat);
            }
        } else if (value === "append-decimal") {
            if (operator === null) {
                if (leftValue === null) {
                    leftValue = "0.";
                    appendToValue = true;
                    newInputDisplayText = leftValue;
                } else if (!leftValue.includes(".")) {
                    leftValue = `${leftValue}.`;
                    newInputDisplayText = `${parseFloat(leftValue).toLocaleString("en-US", inputNumberFormat)}.` ;
                }
            } else {
                if (rightValue === null) {
                    rightValue = "0.";
                    newInputDisplayText = rightValue;
                } else if (!rightValue.includes(".")) {
                    rightValue = `${rightValue}.`;
                    newInputDisplayText = `${parseFloat(rightValue).toLocaleString("en-US", inputNumberFormat)}.`;
                }
            }
        } else if (isOperator(value)) {
            if (leftValue !== null && rightValue != null) {
                result = calculate(operator, leftValue, rightValue);
                leftValue = `${result}`;
                rightValue = null;
                operator = value;
                newCalculationDisplayText = `${result} ${value} `;
                newInputDisplayText = `${parseFloat(result).toLocaleString("en-US", inputNumberFormat)}`;
            } else if (leftValue !== null) {
                operator = `${value}`;
                newCalculationDisplayText = `${leftValue} ${operator}`;
            } 
        } else if (isNumber(value)) {
            if (operator === null) {
                if (appendToValue) {
                    if (leftValue.includes(".") && decimalIsAtMostDecimalMaxLength(leftValue)) {
                        leftValue = `${leftValue}${value}`;                        
                    } else if (!leftValue.includes(".")) {
                        leftValue = `${leftValue}${value}`;                        
                    }
                } else if (value !== "0") {
                    leftValue = value;
                    appendToValue = true;
                }
                if (leftValue !== null) {
                    if (leftValue.includes(".")) {
                        // Split and format int then append decimal back
                        let intValue = leftValue.split(".").at(0);
                        let decimalValue = leftValue.split(".").at(1);
                        newInputDisplayText = `${parseFloat(intValue).toLocaleString("en-US", inputNumberFormat)}.${decimalValue}`;
                    } else {
                        newInputDisplayText = parseFloat(leftValue).toLocaleString("en-US", inputNumberFormat);
                    }
                }
            } else {
                if (rightValue === null && value !== "0") {
                    rightValue = value;
                } else if (rightValue !== null) {
                    if (rightValue.includes(".") && decimalIsAtMostDecimalMaxLength(rightValue)) {
                        rightValue = `${rightValue}${value}`;                        
                    } else if (!rightValue.includes(".")) {
                        rightValue = `${rightValue}${value}`;                        
                    }
                }
                if (rightValue !== null) {
                    if (rightValue.includes(".")) {
                        // Split and format int then append decimal back
                        let intValue = rightValue.split(".").at(0);
                        let decimalValue = rightValue.split(".").at(1);
                        newInputDisplayText = `${parseFloat(intValue).toLocaleString("en-US", inputNumberFormat)}.${decimalValue}`;
                    } else {
                        newInputDisplayText = parseFloat(rightValue).toLocaleString("en-US", inputNumberFormat);
                    }
                }
            }
        }
    } catch (e) {
        resetCalculator();
        newInputDisplayText = e;
        newCalculationDisplayText = ""; 
    }
    inputDisplay.textContent = newInputDisplayText;
    calculationDisplay.textContent = newCalculationDisplayText;
    checkAndSetDisplayFontSize();
}

function checkAndSetDisplayFontSize() {
    let inputDisplay = document.querySelector("#input-display");
    let calculationDisplay = document.querySelector("#calculation-display");
    inputDisplay.style.fontSize = "";
    while (displayOverflowsContainer(inputDisplay)) {
        shrinkDisplayFontSize(inputDisplay);
    }
    if (calculationDisplay !== null) {
        calculationDisplay.style.fontSize = "";
        while (displayOverflowsContainer(calculationDisplay)) {
            shrinkDisplayFontSize(calculationDisplay);
        }
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
        displayElement.style.fontSize = "200%";
    } else if (currentFontSize === "200%") {
        displayElement.style.fontSize = "180%";
    } else if (currentFontSize === "180%") {
        displayElement.style.fontSize = "150%";
    } else if (currentFontSize === "150%") {
        displayElement.style.fontSize = "110%";
    } else if (currentFontSize === "110%") {
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

function decimalIsAtMostDecimalMaxLength(valueWithDecimal) {
    let decimals = valueWithDecimal.split(".").at(1);
    return decimals.length < DECIMAL_MAX_LENGTH;
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
    document.querySelector("#number-invert")
            .addEventListener("click", () => writeToDisplay("invert"));
    document.querySelector("#number-decimal")
            .addEventListener("click", () => writeToDisplay("append-decimal"));
    // Other
    document.querySelector("#equals")
            .addEventListener("click", () => writeToDisplay("equals"));
    document.querySelector("#clear")
            .addEventListener("click", () => writeToDisplay("clear"));
    document.querySelector("#backspace")
            .addEventListener("click", () => writeToDisplay("remove-last-digit"));
}

function initialize() {
    addCalculatorEvents();
}

initialize();