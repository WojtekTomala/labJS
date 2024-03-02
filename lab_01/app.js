// PAGE ELEMENTS:
const firstTaskContainer = document.querySelector(".first-task-container");
const resultContainer = document.querySelector("#results-container");
const simpleForm = document.querySelector("#simple-form");
const addInputBtn = document.querySelector("#add-input");

// RESULT PAGE ELEMENT VARIABLES:
const sumResult = document.querySelector("#sum-result");
const avgResult = document.querySelector("#avg-result");
const minResult = document.querySelector("#min-result");
const maxResult = document.querySelector("#max-result");

// CALCULATE FUNCTIONS:
function getFormValuesToArray(){
    const resultArray = [];
    const inputs = simpleForm.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        resultArray.push(parseFloat(input.value) ? parseFloat(input.value) : 0);
    });
    return resultArray;
}

function calculate(){
    const userInputValues = getFormValuesToArray();
    sumResult.textContent = Math.round(sum(userInputValues));
    avgResult.textContent = Math.round(avg(userInputValues));
    minResult.textContent = Math.round(Math.min.apply(null, userInputValues));
    maxResult.textContent = Math.round(Math.max.apply(null, userInputValues));
}

function avg(userInputArray = []){
    let result = 0;
    userInputArray.forEach(e => {
        result += e;
    });
    return result / userInputArray.length;
}

function sum(userInputArray = []){
    let result = 0;
    userInputArray.forEach(e => {
        result += e;
    });
    return result;
}

// FORM INIT:
const formInputs = [];
addToFormInputs();
addToFormInputs();
addToFormInputs();

addInputBtn.addEventListener("click", () => {
    addToFormInputs();
});

simpleForm.addEventListener("change", (e) => {
    e.preventDefault();
});

function addToFormInputs(){
    formInputs.push(addInputArea(formInputs.length));
    simpleForm.appendChild(addInputArea(formInputs.length));
}

function addInputArea(inputId = 0){
    const newInputContainer = document.createElement("div");
    const closeBtn = document.createElement("button");
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "number");
    newInput.setAttribute("id", `input-${inputId}`);
    closeBtn.textContent = "X";
    newInputContainer.append(newInput, closeBtn);
    newInput.addEventListener("change", (e) => {
        calculate();
    });
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if(formInputs.length > 1){
            e.target.parentNode.remove();
            formInputs.pop(e.target.parentNode);
        }
    })
    return newInputContainer;
}