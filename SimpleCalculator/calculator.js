function clickBtn(btn) {
    const clickedBtn = btn;
    let inputString = document.querySelector("#" + clickedBtn).value;
    const inputBox = document.querySelector("#inputBox");
    if (inputBox.value == 0 || inputBox.value == "") {
        inputBox.value = inputString;
    }
    else if (inputBox.value.length > 15) {
        const messageString = document.querySelector("#messageBox");
        messageString.classList.remove("d-none");
    }
    else {
        inputBox.value += inputString;
    }
}

function allClear() {
    const messageString = document.querySelector("#messageBox");
    messageString.classList.add("d-none");
    const inputBox = document.querySelector("#inputBox");
    inputBox.value = 0;
    inputBox.style.color = "black";
}

function calculate() {
    try {
        const messageString = document.querySelector("#messageBox");
        messageString.classList.add("d-none");
        const inputBox = document.querySelector("#inputBox");
        const errorMessage = "Invalid Input";
        const expression = inputBox.value;
        if (expression.startsWith("+") || expression.startsWith("x") || expression.startsWith("-") || expression.startsWith("/")
            || expression.endsWith("+") || expression.endsWith("-") || expression.endsWith("*") || expression.endsWith("/")
            || expression.includes("/0")) {
            inputBox.style.color = "red";
            throw errorMessage;
        }
        const splittedExpression = expression.split(/([\+\-x\/])/).filter(Boolean);
        let simpleExpression = "";
        let checkOperator = function (operator) {
            while (splittedExpression.includes(operator)) {
                const operatorIndex = splittedExpression.indexOf(operator);
                simpleExpression = splittedExpression[operatorIndex - 1] + splittedExpression[operatorIndex] + splittedExpression[operatorIndex + 1];
                const subExpression = simpleCalculate(simpleExpression);
                splittedExpression.splice(operatorIndex - 1, 3);
                splittedExpression.splice(operatorIndex - 1, 0, subExpression);
            }
        }
        checkOperator("/")
        checkOperator("x");
        checkOperator("+");
        checkOperator("-");
        inputBox.value = splittedExpression.join("");
    } catch (e) {
        inputBox.value = e;
    }
}

function simpleCalculate(simpleExpression) {
    const expression = simpleExpression;
    const numbers = expression.split(/[\+\-x\/]/);
    const firstNo = numbers[0];
    const secondNo = numbers[1];
    const operator = expression[firstNo.length];
    let result = 0.0;
    switch (operator) {
        case "+":
            result = parseFloat(firstNo) + parseFloat(secondNo);
            break;
        case "-":
            result = parseFloat(firstNo) - parseFloat(secondNo);
            break;
        case "x":
            result = parseFloat(firstNo) * parseFloat(secondNo);
            break;
        case "/":
            result = parseFloat(firstNo) / parseFloat(secondNo);
            break;
    }
    return result.toFixed(3);
}