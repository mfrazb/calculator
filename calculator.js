// take user's operator choice and calls function to perform math operation
function operate(operator, str1, str2) {
    // convert number strings to nums 
    const num1 = Number(str1);
    const num2 = Number(str2);

    // call appropriate callback based on operator passed in
    if (operator === '+') return add(num1, num2);
    if (operator === "-") return subtract(num1, num2);
    if (operator === "*") return multiply(num1, num2);
    if (operator === "/") return divide(num1, num2);
    if (operator === "%") return modulus(num1, num2);
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

// create event listeners for clicks and keydowns 

function displayInput() {
    // closure to record 1st invocation and screen values
    let firstInvocation = true;
    let pressedEqual = false;

    //store past inputs and outputs
    const cache = [];

    // create closure to hold screen values as buttons are pressed
    let screenInput = document.getElementById("screen-input");
    let screenOutput = document.getElementById("screen-output"); 
    let history = document.getElementById("show-history");

    let string1 = ``;
    let operator = ``;
    let string2 = ``;


    function checkValue(event) {

        const clickedValue = event.target.textContent;
        const clickedId = event.target.id;

        // const lastValueClicked = string1[string1.length - 1];

        // user clicks values to form single or multi-digit number OR select operator
        // example user clicks 3, user clicks 7 - display shows '37'

        //user inputs 1st num
        if (Number(clickedValue) && firstInvocation) {
            string1 = clickedValue;
            screenInput.textContent = string1;
            firstInvocation = false;
        } else if (Number(clickedValue) && !operator){
            // user inputs additional digits of 2nd num
            string1 += clickedValue;
            screenInput.textContent = string1;
        } else if (!Number(clickedValue) && !operator) {
            // user inputs operator 
            operator = `${clickedValue}`;
            screenInput.textContent += ` ${operator}`;
        } else if (!Number(clickedValue) && operator && !string2) {
            // user updates operator 
            operator = `${clickedValue}`;
            screenInput.textContent = `${string1} ${operator}`
        } else if (Number(clickedValue) && string1 && operator && !string2) {
            // user inputs first digit of second num
            string2 += clickedValue;
            screenInput.textContent += ` ${string2}`;
        } else if (Number(clickedValue) && string1 && operator && string2 && !pressedEqual) {
            // user inputs additional digits of second num 
            string2 += clickedValue;
            screenInput.textContent += clickedValue;
        } else if (clickedValue === '=') {
            // when user clicks equal

            if (!pressedEqual) {
                // add equal sign to input
                screenInput.textContent += ` ${clickedValue}`;
                pressedEqual = true;
            }
            // run math operation
            let output = operate(operator, string1, string2);
            // update output on screen
            screenOutput.textContent = output;
            // store input and output in history
            cache.push({[output]: screenInput.textContent});
            console.log(cache);
        } else if (clickedValue === "Backspace" && !pressedEqual) {
            screenInput.textContent = screenInput.textContent.slice(0, -1);
        } else if (clickedValue === "Clear") {
            string1 = ``;
            operator = ``;
            string2 = ``;
            screenInput.textContent = 0;
            screenOutput.textContent = ``;
        } else if (clickedId === "show-history") {
            // show history in screen display
            console.log(cache);
        }
    }


    return checkValue;
}



// when user clicks button, start math on calculator 

const numsAndOperators = [...document.querySelectorAll(".num-button"), 
                          ...document.querySelectorAll(".operator-button"),
                          ...document.querySelectorAll(".options-button"),
                          document.querySelector(".equal-button")
                        ];

// when user clicks button, displayInput stores user input and saves past history
const currDisplay = displayInput();

numsAndOperators.forEach(button => {
    button.addEventListener("click", currDisplay);
});







