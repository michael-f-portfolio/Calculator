/* 
 * Calculator Application 
 * Based on the following Odin Project Assignment: 
 * https://www.theodinproject.com/lessons/foundations-calculator
 * 
 * Responsive calculator application which allows the user to Add, Subtract, Multiply and Divide.
 * Features include: 
 * Display screen resizes numbers to always fit in the display.
 * Somewhat responsive based on screen size.
 * Error messages for:
 *      Will throw an out of bounds error if result is in scientific notation.
 *      Attempting to divide by zero.
 *      Squaring very large numbers or very small numbers.
 * TODO:
 * Implement Memory Store and Memory Clear functions which...
 *      Will store the current value in the input display by pressing "MS".
 *      Will input the stored value into input display by pressing "MR".
 *      "Clear" will not remove the stored value.
 * Implement ability to use keyboard to input values.
 * Break up repetitive code blocks into their own functions DRY DRY DRY
 * BUGS:
 * Resizing the window while a large value is in either the input display or calculation display can cause 
 * the text to go out of bounds of it's container.
 */
// Constants
const DECIMAL_MAX_LENGTH = 15;
const RESULT_MAX_LENGTH = 21;
const inputNumberFormat = {
    maximumSignificantDigits: DECIMAL_MAX_LENGTH
}

// Calculation Variables
let leftValue = null;
let originalLeftValue = null;
let leftValueAsString = null;
let operator = null;
let rightValue = null;
let originalRightValue = null;
let rightValueAsString = null;

// Other Variables
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

function mod(num1, num2) {
    return num1 % num2;
}

function square(num1) {
    return Math.pow(num1, 2);
}

function squareRoot(num1) {
    return Math.sqrt(num1);
}

function operate(operator, num1, num2) {
    let result;
    if (operator === "+") {
        result = add(num1, num2);
    } else if (operator === "-") {
        result = subtract(num1, num2);
    } else if (operator === "*") {
        result = multiply(num1, num2);
    } else if (operator === "/") {
        result = divide(num1, num2);
        if (result === Infinity || !isNumber(result)) 
            throw "Cannot divide by zero";
    } else if (operator === "Mod") {
        result = mod(num1, num2);
    } else if (operator === "square") {
        result = square(num1);
        if (result === Infinity || (hasResult && result === 0)) 
            throw "Number out of bounds";
    } else if (operator === "square-root") {
        result = squareRoot(num1);
    }
    return result;
}

function clearCalculator() {
    leftValue = null;
    operator = null;
    rightValue = null;
    originalLeftValue = null;
    originalRightValue = null;
    hasResult = false;
}

function calculate(operator, leftValue, rightValue) {
    let result = operate(operator, parseFloat(leftValue), parseFloat(rightValue));
    hasResult = true;
    return result;
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
            if (rightValue !== null && originalRightValue === null) {
                result = calculate(operator, parseFloat(leftValue), parseFloat(rightValue));
                newCalculationDisplayText = `${leftValue} ${operator} ${rightValue} =`;
                originalRightValue = rightValue;
                rightValue = null;
            } else if (originalRightValue !== null) {
                result = calculate(operator, parseFloat(leftValue), parseFloat(originalRightValue));
                newCalculationDisplayText = `${leftValue} ${operator} ${originalRightValue} =`;
            } else {
                if (originalLeftValue === null) {
                    originalLeftValue = leftValue;
                }
                result = calculate(operator, parseFloat(leftValue), parseFloat(originalLeftValue));
                newCalculationDisplayText = `${leftValue} ${operator} ${originalLeftValue} =`;
            }
            if (`${result}`.includes("e")) {
                throw "Number is out of bounds";
            } else {
                newInputDisplayText = result.toLocaleString("en-US", inputNumberFormat);
            }
            leftValue = result;
        } else if (value === "square" && leftValue !== null) {
            if (rightValue !== null) {
                result = calculate(operator, leftValue, calculate(value, rightValue));
                newCalculationDisplayText = `${leftValue} ${operator} sqr(${rightValue}) = `;
                leftValue = result;
                rightValue = null;
                newInputDisplayText = result.toLocaleString("en-US", inputNumberFormat);
            } else {
                if (originalLeftValue === null) {
                    originalLeftValue = leftValue
                }
                result = calculate(value, leftValue);
                leftValue = result;
                newCalculationDisplayText = originalLeftValue = `sqr(${originalLeftValue})`;
                if (`${result}`.includes("e")) {
                    newInputDisplayText = `${result}`;
                } else {
                    newInputDisplayText = result.toLocaleString("en-US", inputNumberFormat);
                }
            }
        } else if (value === "square-root" && leftValue !== null) {
              if (rightValue !== null) {
                result = calculate(operator, leftValue, calculate(value, rightValue));
                newCalculationDisplayText = `${leftValue} ${operator} √(${rightValue}) = `;
                leftValue = result;
                rightValue = null;
                newInputDisplayText = result.toLocaleString("en-US", inputNumberFormat);
              } else {
                if (originalLeftValue === null) {
                    originalLeftValue = leftValue;
                }
                result = calculate(value, leftValue);
                leftValue = result;
                newCalculationDisplayText = originalLeftValue = `√(${originalLeftValue})`;
                newInputDisplayText = result.toLocaleString("en-US", inputNumberFormat);
              }
        } else if (value === "remove-last-digit") {
            if (rightValue === null && leftValue !== null) {
                const workingValueObj = removeLastDigitFromWorkingValue(leftValueAsString);
                leftValue = workingValueObj.workingValue;
                leftValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(leftValueAsString);
            } else if (rightValue !== null && !hasResult) {
                const workingValueObj = removeLastDigitFromWorkingValue(rightValueAsString);
                rightValue = workingValueObj.workingValue;
                rightValueAsString= workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(rightValueAsString);
            }
        } else if (value === "clear") {
            clearCalculator();
            newInputDisplayText = "0";
            newCalculationDisplayText = ""; 
        } else if (value === "invert") {
            if (operator === null && leftValue !== null) {
                // No operator so we're working with the left value
                const workingValueObj = invertWorkingValue(leftValue);
                leftValue = workingValueObj.workingValue;
                leftValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(leftValueAsString);
            } else {
                // There is an operator, so we're working with the right value
                const workingValueObj = invertWorkingValue(rightValue);
                rightValue = workingValueObj.workingValue;
                rightValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(rightValueAsString);
            }
        } else if (value === "append-decimal") {
            if (operator === null) {
                // No operator so we're working with the left value
                const workingValueObj = appendDecimalToWorkingValue(leftValue);
                leftValue = workingValueObj.workingValue;
                leftValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(leftValueAsString);
            } else {
                // There is an operator, so we're working with the right value
                const workingValueObj = appendDecimalToWorkingValue(rightValue);
                rightValue = workingValueObj.workingValue;
                rightValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(rightValueAsString);
            }
        } else if (isOperator(value)) {
            if (rightValue !== null) {
                result = calculate(operator, leftValue, rightValue);
                leftValue = result;
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
                // No operator so we're working with the left value
                const workingValueObj = appendNumberToWorkingValue(value, leftValue, leftValueAsString);
                leftValue = workingValueObj.workingValue;
                leftValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(leftValueAsString);
            } else {
                // There is an operator, so we're working with the right value
                const workingValueObj = appendNumberToWorkingValue(value, rightValue, rightValueAsString);
                rightValue = workingValueObj.workingValue;
                rightValueAsString = workingValueObj.workingValueAsString;
                newInputDisplayText = formatDisplayText(rightValueAsString);
            }
        }
    } catch (e) {
        clearCalculator();
        newInputDisplayText = e;
        newCalculationDisplayText = ""; 
    }
    inputDisplay.textContent = newInputDisplayText;
    calculationDisplay.textContent = newCalculationDisplayText;
    checkAndSetDisplayFontSize();
}

function invertWorkingValue(workingValue) {
    let invertedValue = workingValue *= -1
    return {
        workingValue: invertedValue,
        workingValueAsString: `${invertedValue}`
    }
}

function removeLastDigitFromWorkingValue(workingValueAsString) {
    workingValueAsString = workingValueAsString.slice(0, workingValueAsString.length - 1);
    if (workingValueAsString === "" || workingValueAsString === "-") {
        return {
            workingValue: null,
            workingValueAsString: null
        };
    } else {
        return {
            workingValue: parseFloat(workingValueAsString),
            workingValueAsString: workingValueAsString
        };
    } 
}

function appendDecimalToWorkingValue(workingValue) {
    if (workingValue === null) {
        return {
            workingValue: 0,
            workingValueAsString: "0."
        };
    } else {
        return {
            workingValue: workingValue,
            workingValueAsString: `${workingValue}.`
        };
    }
}

function appendNumberToWorkingValue(valueToAppend, workingValue, workingValueAsString) {
    if (workingValue === null) {
        if (valueToAppend !== "0") {
            return { 
                workingValue: parseInt(valueToAppend),
                workingValueAsString: valueToAppend 
            };
        } else {
            return {
                workingValue: null,
                workingValueAsString: null
            };
        }
    } else {
        if (workingValueAsString === null) {
            workingValueAsString = `${workingValue}`;
        }
        if (workingValueAsString.includes(".")) {
            workingValueAsString = `${workingValueAsString}${valueToAppend}`
            return {
                workingValue: parseFloat(workingValueAsString),
                workingValueAsString: workingValueAsString
            };
        } else {
            workingValueAsString = `${workingValue}${valueToAppend}`;
            return { 
                workingValue: parseInt(workingValueAsString),
                workingValueAsString: workingValueAsString
            };
        }
    }
}

function formatDisplayText(inputDisplayText) {
    if (inputDisplayText === null) {
        return "0";
    } else if (inputDisplayText.includes(".")) {
        let integers = inputDisplayText.split(".").at(0);
        let decimals = inputDisplayText.split(".").at(1);
        return `${parseInt(integers).toLocaleString("en-US", inputNumberFormat)}.${decimals}`;
    } else {
        return parseInt(inputDisplayText).toLocaleString("en-US", inputNumberFormat);
    }
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

function doesNotExceedDecimalMaxLength(valueWithDecimal) {
    let decimals = valueWithDecimal.split(".").at(1);
    return decimals.length < DECIMAL_MAX_LENGTH;
}

function isOperator(value) {
    return value === "+" || 
           value === "-" || 
           value === "/" || 
           value === "*" || 
           value === "Mod";
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
    document.querySelector("#modulo")
            .addEventListener("click", () => writeToDisplay("Mod"));
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
    document.querySelector("#square")
            .addEventListener("click", () => writeToDisplay("square"));
    document.querySelector("#square-root")
            .addEventListener("click", () => writeToDisplay("square-root"));
    document.querySelector("#clear")
            .addEventListener("click", () => writeToDisplay("clear"));
    document.querySelector("#backspace")
            .addEventListener("click", () => writeToDisplay("remove-last-digit"));
}

function initialize() {
    addCalculatorEvents();
}

initialize();