let score = 0;

const questions = [

{
code:
`for(let i=0; i<5 i++){
 console.log(i);
}`,

options:[
"Missing semicolon",
"Missing operator",
"Missing bracket",
"Nothing wrong"
],

answer:"Missing semicolon"
},

{
code:
`function test(){
 console.log("Hello")
`,

options:[
"Missing bracket",
"Missing semicolon",
"Missing variable",
"Nothing wrong"
],

answer:"Missing bracket"
},

{
code:
`let x == 5;`,

options:[
"Wrong assignment operator",
"Missing bracket",
"Missing semicolon",
"Nothing wrong"
],

answer:"Wrong assignment operator"
},

{
code:
`console.log(name);`,

options:[
"Undefined variable",
"Missing bracket",
"Missing semicolon",
"Nothing wrong"
],

answer:"Undefined variable"
}

];

let currentQuestion = 0;

function loadQuestion(){

document.getElementById("result").textContent="";

const q = questions[currentQuestion];

document.getElementById("code-block").textContent=q.code;

const optionsDiv=document.getElementById("options");

optionsDiv.innerHTML="";

q.options.forEach(option=>{

const btn=document.createElement("button");

btn.textContent=option;

btn.classList.add("option");

btn.onclick=()=>checkAnswer(option);

optionsDiv.appendChild(btn);

});
}

function checkAnswer(selected){

const correct=questions[currentQuestion].answer;

if(selected===correct){

score++;

document.getElementById("score").textContent=score;

document.getElementById("result").textContent="✅ Correct";

}
else{

document.getElementById("result").textContent=
"❌ Wrong! Answer: " + correct;

}
}

function nextQuestion(){

currentQuestion++;

if(currentQuestion>=questions.length){

alert("Game Finished!\nScore: " + score);

currentQuestion=0;

score=0;

document.getElementById("score").textContent=0;
}

loadQuestion();
}

loadQuestion();