const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let score = 0;
let timeLeft = 30;
let currentMole = null;

for(let i=0; i<9; i++){

    const hole = document.createElement("div");

    hole.classList.add("hole");

    hole.id = i;

    hole.addEventListener("click", hitMole);

    grid.appendChild(hole);
}

function randomMole(){

    document.querySelectorAll(".hole").forEach(hole => {

        hole.classList.remove("mole");

        hole.textContent = "";
    });

    let randomIndex = Math.floor(Math.random() * 9);

    currentMole = document.getElementById(randomIndex);

    currentMole.classList.add("mole");

    currentMole.textContent = "🐹";
}

function hitMole(){

    if(this === currentMole){

        score++;

        scoreDisplay.textContent = score;

        currentMole.classList.remove("mole");

        currentMole.textContent = "";
    }
}

function startGame(){

    score = 0;
    timeLeft = 30;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    const moleInterval = setInterval(randomMole, 700);

    const timer = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent = timeLeft;

        if(timeLeft <= 0){

            clearInterval(timer);
            clearInterval(moleInterval);

            alert("🎉 Game Over! Score: " + score);
        }

    },1000);
}