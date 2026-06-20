const colors = ["red","green","blue","yellow"];

let gamePattern = [];
let userPattern = [];
let level = 0;

function startGame(){

    gamePattern = [];
    level = 0;

    nextLevel();
}

function nextLevel(){

    userPattern = [];

    level++;

    document.getElementById("level").textContent =
        "Level " + level;

    const randomColor =
        colors[Math.floor(Math.random()*4)];

    gamePattern.push(randomColor);

    flashButton(randomColor);
}

function flashButton(color){

    const btn = document.getElementById(color);

    btn.classList.add("flash");

    setTimeout(()=>{
        btn.classList.remove("flash");
    },300);
}

document.querySelectorAll(".btn").forEach(btn=>{

    btn.addEventListener("click",function(){

        const color = this.id;

        userPattern.push(color);

        checkAnswer(userPattern.length-1);
    });
});

function checkAnswer(index){

    if(userPattern[index] === gamePattern[index]){

        if(userPattern.length === gamePattern.length){

            setTimeout(nextLevel,1000);
        }
    }
    else{

        document.getElementById("level").textContent =
            "❌ Game Over! Press Start";

        gamePattern = [];
        userPattern = [];
    }
}