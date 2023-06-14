// perform math operations on user's input when user presses equal
function operate(array) {
    //input - array of nums and operatos
    // output - result of math operations 

    // convert string numbers to number values for calculations 
    const calcArray = array.map(element => {
        if (Number(element) || element === "0") {
            return Number(element);
        } else return element;
    });




    // base case - if array has length of 1, return value at index 0
    if (calcArray.length <= 1) return array[0];

    if (calcArray.includes("%")) return modulus(array[0], array[2]);

    // recursive case

    // perform primary operations and reduce related portions of array
    for (let i = 0; i < calcArray.length; i++) { // 3 * 2 + 1 * 5, [3, *, 2, +, 1, *, 5]
        if (calcArray[i] === "*") {
            let currOutput = multiply(calcArray[i - 1], calcArray[i + 1]);
            calcArray.splice(i - 1, 3, currOutput);
        } else if (calcArray[i] === "/") {
            let currOutput = divide(calcArray[i - 1], calcArray[i + 1]);
            calcArray.splice(i - 1, 3, currOutput);
        }

    }

    // perform secondary operations and reduce related portions of array 
    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "+") {
            let currOutput = add(calcArray[i - 1], calcArray[i + 1]);
            calcArray.splice(i - 1, 3, currOutput);
        } else if (calcArray[i] === "-") {
            let currOutput = subtract(calcArray[i - 1], calcArray[i + 1]);
            calcArray.splice(i - 1, 3, currOutput);
        }
    }

    return operate(calcArray);
}

// callback functions to perform math operations

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

function modulus(num1, num2) {
    return Math.floor(num1 / num2) + " rem " + (num1 % num2);
}


// when user clicks button, calculator program starts

function calculator() {
    //input - none 
    //output - checkValue function with closure for inputs, output, and cache of past calculations

    // store past and current inputs and outputs
    const cache = [];
    const inputArray = [];

    // record if user has pressed equal
    let pressedEqual = false;

    // update screen values as buttons are pressed
    let screenInput = document.getElementById("screen-input");
    let screenOutput = document.getElementById("screen-output");
    let history = document.getElementById("show-history");

    let lastClickedValue;
    let lastClickedElement;
    let lastClickedClasses;


    // when user clicks button, related func invokes - addInput, returnOutput, clearInput, or showHistory
    function checkValue(event) {
        //input - all click events on all buttons 
        //output - invokes particular func based on which button user clicks on 

        const clickedValue = event.target.textContent;
        const clickedId = event.target.id;
        const clickedClasses = [...event.target.classList];

        function addInput(event) {
            // input - user click events on number and operator buttons 
            // output - numbers and chosen operator, screen input 

            // USER STARTS NEXT OPERATION

            // user continues operation on previous output
            if (clickedClasses.includes("operator-button") && pressedEqual) {
                inputArray.push(clickedValue);
                pressedEqual = false;
            } else if (clickedClasses.includes("num-button") && pressedEqual) {
                // user starts new operation right after previous by clicking number
                inputArray.pop();
                inputArray.push(clickedValue);
                pressedEqual = false;
                screenOutput.textContent = ``;
            } else if (clickedValue === "0" && inputArray[inputArray.length - 1] === "0") {
                // USER TRIES TO INPUT INVALID NUMBER OR OPERATION

                // user tries to input 00 as a number
                console.log("00 is not a valid entry");
            } else if (clickedValue === "0" && lastClickedValue === "/") {
                // user tries to divide by 0
                console.log(`You can't divide by 0`);
            } else if ((inputArray.includes("%") && clickedClasses.includes("operator-button")) || 
                        (clickedValue === "%" && 
                        inputArray.some(element => ["+", "-", "*", "/", "%"].includes(element)))) {
            // user tries to use modulus in operation with multiple operators
            console.log("You can't use modulus in combination with other operators");
        } else if (clickedClasses.includes("num-button") && !Number(lastClickedValue) && lastClickedValue !== "0") {
                // USER INPUTS VALID OPERATION

                // user inputs first digit of num
                inputArray.push(clickedValue);
            } else if (clickedClasses.includes("num-button") && lastClickedClasses.includes("num-button")) {
                // user inputs additional digits of current num, including 0
                inputArray[inputArray.length - 1] += clickedValue;
            } else if (clickedClasses.includes("operator-button") && 
                        (!lastClickedClasses.includes("operator-button") &&
                        !lastClickedClasses.includes("options-button") && 
                        lastClickedValue !== "0")) {
                            console.log('here');
                // user inputs operator first time
                inputArray.push(clickedValue);
            } else if (clickedClasses.includes("operator-button") && !Number(lastClickedValue)) {
                // user updates current operator 
                inputArray[inputArray.length - 1] = clickedValue;
            }

            // update input on screen 
            screenInput.textContent = inputArray.join(' ');

        }

        function returnOutput(event) {
            //input - user click event on equal button 
            //output - displays output on screen, saves output in cache 

            // let user complete operation after they have provided necessary input
            if (!pressedEqual && inputArray.length >= 3 && Number(inputArray[inputArray.length - 1])) {
                // run math operation
                const output = operate(inputArray);
                // display output on screen
                screenOutput.textContent = output;
                // store input and output in history
                cache.push({ [output]: screenInput.textContent });
                console.log(cache);

                while (inputArray.length) {
                    inputArray.pop();
                }

                // update future input to previous output if user decides to do more operations
                inputArray.push(output);

                pressedEqual = true;
            }
        }

        function clearInput(event) {
            //input - user click event on backspace or clear button
            //output - resets input and removes output from screen, resets variables so user can perform more calculations 

            console.log(pressedEqual);
            //if user clicks backspace, update displayed input and closures for string1, operator, or string2
            if (clickedId === "backspace" && !pressedEqual) {

                if (inputArray[inputArray.length - 1].length > 1) {
                    inputArray[inputArray.length - 1] = inputArray[inputArray.length - 1].slice(1);
                }
                else {
                    inputArray.pop();
                }

                // update input on screen 
                screenInput.textContent = inputArray.join(' ');

            } else if (clickedId === "backspace" && pressedEqual) {
                // if user tries to hit backspace after operation has been performed, don't change interface and log message to console
                console.log(`User already pressed equal. Cannot backspace`);
            }

            // if user clicks clear, reset all values and display 0 on input screen
            if (clickedValue === "Clear") {

                screenInput.textContent = 0;
                screenOutput.textContent = ``;
                while (inputArray.length) inputArray.pop();
                pressedEqual = false;
            }
        }

        function showHistory(event) {
            const pastOperations = document.getElementById("past-operations");
            console.log(pastOperations);
        }

        // choose which function to invoke based on user input 

        // if the clicked value is a number or operator, invoke addInput 
        if (clickedClasses.includes("num-button") ||
            clickedClasses.includes("operator-button")) addInput(event);
        // if the clicked value is the equal sign, invoke returnOutput
        if (clickedClasses.includes("equal-button")) returnOutput(event);
        // if the clicked value is backspace or clear, invoke clearInput 
        if (clickedId === "backspace" || clickedId === "clear") clearInput(event);
        // if the clicked value is Show History, invoke showHistory 
        if (clickedId === "show-history") showHistory(event);



        // store clicked values for next time user clicks a button
        lastClickedValue = clickedValue;
        lastClickedElement = event.target;
        lastClickedClasses = clickedClasses;

        console.log(inputArray);

    }



    return checkValue;
}

// when user clicks button, user starts calculator
const runCalculator = calculator();

const allButtons = [...document.querySelectorAll(".num-button"),
...document.querySelectorAll(".operator-button"),
...document.querySelectorAll(".options-button"),
document.querySelector(".equal-button")
];

allButtons.forEach(button => {
    button.addEventListener("click", runCalculator);
});