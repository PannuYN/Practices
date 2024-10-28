//the whole script is all about showing the sentence when button is clicked and hiding it when the button is clicked again

let sentence = document.querySelector("#sentence"); //fetch sentence element by id
let btn = document.querySelector("#start_btn"); //fetch button by id

//Let's start button function
function show() { 
    sentence.style.margin = "auto"; //styling sentence before showing
    sentence.style.display = "block"; //show the sentence

    //change the button into rest button when clicked
    btn.textContent = "Reset"; //change name
    btn.setAttribute("onclick", "hide()"); //change function to hide the sentence
}

//Reset button function
function hide() {
    sentence.style.display = "none"; //hide the sentence when clicked
    
    //change the button into let's start button when clicked
    btn.textContent = "Let's Start!"; //change name
    btn.setAttribute("onclick", "show()"); //change function to show the sentence
}
