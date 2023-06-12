



function createMultipleEls(el, num, parent, ...classes) {
    //input - number of divs to make, parent el to append to, classes array to add
    
    let counter = 1;

    while (counter <= num) {
        const newElement = document.createElement(el);
        console.log(newElement);
        classes.forEach(label => newElement.classList.add(label));
        parent.appendChild(newElement);
        counter++;
    }  
}

// create 11 number buttons 
const numberPad = document.querySelector(".numbers");

createMultipleEls("div", 11, numberPad, "num-button", "numbers");