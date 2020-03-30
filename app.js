function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return b == 0 ? "divide by 0" : +(a / b).toFixed(8);
}

let operator = function(a, operand, b) {
  a = +a;
  b = +b;
  switch (operand) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return "invalid input";
  }
};

let buttons = document.querySelectorAll(".button");
let numbers = document.querySelectorAll(".number");
let calcBody = document.querySelector(".calc-body");
let screenText = document.querySelector(".screen-text");
screenText.textContent = "";
let numberArray = [];
let numCount = 0;
let operatorArray = [];
let previousExpressions = [];
let decimal = document.querySelector("#decimal");
let divi = document.querySelector("[data-operand = 'divide']");
let mult = document.querySelector("[data-operand = 'multiply']");

let previousList = document.createElement("div");
previousList.style.width = 300 + "px";
previousList.style.height = 100 + "px";
previousList.style.marginTop = 100 + "px";

calcBody.appendChild(previousList);

buttons.forEach(button => {
  button.addEventListener("click", () => {
    button.classList.add("active");
  });

  button.addEventListener("transitionend", () => {
    button.classList.remove("active");
  });
});

numbers.forEach(num => {
  num.addEventListener("click", function() {
    if (
      !(num.dataset.value == "." && decimal.classList.contains("unavailable"))
    )
      screenText.textContent += num.textContent;
    mult.classList.remove("unavailable");
    divi.classList.remove("unavailable");
    console.log(num.dataset.value);
  });
});

operators = document.querySelectorAll(".operator");
operators.forEach(operand => {
  operand.addEventListener("click", e => {
    if (
      !(
        (operand.id == "*" || operand.id == "/") &&
        operand.classList.contains("unavailable")
      )
    ) {
      screenText.textContent += operand.textContent;
      decimal.classList.remove("unavailable");
      if (operand.id == "*" || operand.id == "/") {
        mult.classList.add("unavailable");
        divi.classList.add("unavailable");
      }
    }
  });
});

backspace = document.querySelector("#Back");
backspace.addEventListener("click", () => {
  currentText = screenText.textContent;
  currentArray = currentText.split("");
  lastPressed = currentArray.pop();
  if (lastPressed == ".") decimal.classList.remove("unavailable");
  newArray = currentArray;
  console.log(newArray);
  newText = newArray.join("");
  screenText.textContent = newText;
});

let equals = document.querySelector("#equals");
equals.addEventListener("click", function() {
  let answer = evaluate(screenText.textContent);
  updatePrevious(screenText.textContent, answer);
  reset();
  screenText.textContent = answer;
  console.log(answer);
  let stringAsnwer = answer.toString();
  console.log(stringAsnwer);
  ArrayAnswer = stringAsnwer.split("");
  console.log(ArrayAnswer);
  containsDecimal = ArrayAnswer.find(function(element) {
    return element == ".";
  });
  console.log(containsDecimal);
  if (containsDecimal == ".") {
    decimal.classList.add("unavailable");
  }
});

let clear = document.querySelector("#CE");
clear.addEventListener("click", () => {
  reset();
  screenText.textContent = "";
});

let Return = document.querySelector("#Return");
Return.addEventListener("click", () => {
  reset();
});

function reset() {
  screenText.textContent = "0";
  numberArray = [];
  operatorArray = [];
  numCount = 0;
  decimal.classList.remove("unavailable");
  mult.classList.remove("unavailable");
  divi.classList.remove("unavailable");
}

decimal.addEventListener("click", () => decimal.classList.add("unavailable"));

function evaluate(inputString) {
  console.log(inputString);
  re = /([-+*/])/;
  splitStringArray = inputString.split(re);
  noSpaces = splitStringArray.filter(letter => letter != "");

  for (let index = 0; index < noSpaces.length; index++) {
    let item = noSpaces[index];
    let next = noSpaces[index + 1];
    if (item == "") {
      noSpaces.splice(index, 1);
    }
    if (item == "-") {
      if (next == "+") {
        noSpaces.splice(index + 1, 1);
      } else if (next == "-") {
        noSpaces.splice(index, 2, "+");
      }
    } else if (item == "+") {
      if (next == "+") {
        noSpaces.splice(index, 1);
      } else if (next == "-") {
        noSpaces.splice(index, 1);
      }
    }
  }

  bidmasReady = attatchMinus(noSpaces);
  messyArray = bidmasSolver(bidmasReady);
  console.log(messyArray);

  Answer = messyArray.reduce(getSum, 0);

  return Answer;
}

function attatchMinus(toAttach) {
  for (let index = 0; index < toAttach.length; index++) {
    const minustest = toAttach[index];
    if (minustest == "-") {
      toAttach.splice(index, 2, "-" + toAttach[index + 1]);
    } else if (minustest == "+") {
      toAttach.splice(index, 1);
    }
  }
  return toAttach;
}

function bidmasSolver(Array) {
  for (let index = 0; index <= Array.length; index++) {
    if (Array[index] == "*" || Array[index] == "/") {
      Array.splice(
        index - 1,
        3,
        operator(Array[index - 1], Array[index], Array[index + 1])
      );
      index--;
    }
  }
  console.log(Array);
  return Array;
}

function getSum(total, current) {
  current = +current;
  return total + current;
}

function updatePrevious(expression, answer) {
  let newLine = expression + answer;
  previousExpressions.push(newLine);
}
