const simpleForm = document.querySelector("#simple-form");
const firstTaskContainer = document.querySelector(".first-task-container");
/*
- Utwórz w html cztery pola tekstowe i przycisk "Przelicz"
- Po naciśnięciu "Przelicz" pokaż na stronie sumę, średnią, min i max z wartości wpisanych do pól tekstowych.
*/

const sumResult = document.querySelector("#sum-result");
const avgResult = document.querySelector("#avg-result");
const minResult = document.querySelector("#min-result");
const maxResult = document.querySelector("#max-result");
function avg(){

}
const formInputs = [];
const resultContainer = document.querySelector("#results-container");

addToFormInputs();

function calculate(){
    addToFormInputs();
    
    Array.from(simpleForm.elements).forEach((input) => {
        if(Number(input.value)){
            console.log(input.value);
        }
    });

    sumResult.textContent = "1";
    avgResult.textContent = "2";
    minResult.textContent = "3";
    maxResult.textContent = "4";
};


function addToFormInputs(){
    formInputs.push(addInputArea(formInputs.length));
    simpleForm.appendChild(addInputArea(formInputs.length));
    console.log(formInputs.length)
}

function addInputArea(inputId = 0){
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "number");
    newInput.setAttribute("id", `input-${inputId}`);
    newInput.addEventListener("change", (e) => {
        console.log(e.target);
        calculate();
    });
    return newInput;
}

simpleForm.addEventListener("change", (e) => {
    e.preventDefault();
    console.log("change")
});

/*  
    const userInputs = [];

    Array.from(simpleForm.querySelector("input[type='number']")).forEach((input) => {
        console.log(input);
    });

    // GET FORM VALUES:
    const userInput1 = parseFloat(simpleForm.querySelector("input[name='input-1']").value);
    const userInput2 = parseFloat(simpleForm.querySelector("input[name='input-2']").value);
    const userInput3 = parseFloat(simpleForm.querySelector("input[name='input-3']").value);
    const userInput4 = parseFloat(simpleForm.querySelector("input[name='input-4']").value);

    const resultData = document.createElement("div");
    
    // ADDING DATA RESULT:
    const sumInfo = document.createElement("p");
    sumInfo.textContent = userInput1 + userInput2 + userInput3 + userInput4;
    const avgInfo = document.createElement("p");
    avgInfo.textContent = "";
    const minInfo = document.createElement("p");
    minInfo.textContent = Math.min(userInput1,userInput2,userInput3,userInput4);
    const maxInfo = document.createElement("p");
    maxInfo.textContent = Math.max(userInput1,userInput2,userInput3,userInput4);

    resultData.append(sumInfo, avgInfo, minInfo, maxInfo);
    firstTaskContainer.appendChild(resultData);

*/