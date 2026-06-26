const defaultPlayer = {
    name: "Guest Player",
    level: 1,
    xp: 0,
    gamesPlayed: 0,
    achievements: [],
    favorites: [],
    recentlyPlayed: [],
    highScores: {}
};

if(!localStorage.getItem("player")){

    localStorage.setItem("player",JSON.stringify(defaultPlayer));

}
const searchInput = document.getElementById("searchInput");

const cards = document.querySelectorAll(".game-card");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    cards.forEach(card => {

        const text = card.dataset.name.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

const buttons = document.querySelectorAll(".filter-btn");

buttons.forEach(button => {

button.addEventListener("click", ()=>{

buttons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

const filter = button.dataset.filter;

cards.forEach(card=>{

const category = card.dataset.category;

if(filter==="all" || category.includes(filter)){

card.style.display="block";

}

else{

card.style.display="none";

}

});

});

});

const themeButton = document.getElementById("themeToggle");

if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light");

    themeButton.textContent = "☀️";

}

themeButton.addEventListener("click", ()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

        themeButton.textContent="☀️";

    }

    else{

        localStorage.setItem("theme","dark");

        themeButton.textContent="🌙";

    }

});

const gameCards = document.querySelectorAll(".game-card");

let games = 0;
let developer = 0;

gameCards.forEach(card => {

    const category = card.dataset.category;

    if(category.includes("games")){

        games++;

    }

    if(category.includes("developer")){

        developer++;

    }

});

document.getElementById("gamesCount").textContent = games;

document.getElementById("devCount").textContent = developer;

document.getElementById("totalCount").textContent = games + developer;

const player = JSON.parse(localStorage.getItem("player"));

document.getElementById("playerName").textContent = player.name;

document.getElementById("level").textContent = player.level;

document.getElementById("xp").textContent = `${player.xp}/100`;

document.getElementById("achievements").textContent = player.achievements;

document.getElementById("gamesPlayed").textContent = player.gamesPlayed;

document.getElementById("favorites").textContent = player.favorites;
let player = JSON.parse(localStorage.getItem("player"));

player.gamesPlayed++;

localStorage.setItem("player",JSON.stringify(player));

let player = JSON.parse(localStorage.getItem("player"));

player.xp += 20;

if(player.xp >= 100){

    player.level++;

    player.xp = 0;

}

localStorage.setItem("player",JSON.stringify(player));

const achievementList = [

{

id:"first_game",

title:"🎮 First Victory",

description:"Play your first game."

},

{

id:"snake_master",

title:"🐍 Snake Master",

description:"Score 100+ in Snake."

},

{

id:"bug_hunter",

title:"🐞 Bug Hunter",

description:"Complete Bug Hunter."

},

{

id:"memory_master",

title:"🧠 Memory Master",

description:"Complete Memory Card Game."

},

{

id:"puzzle_king",

title:"🎮 Puzzle King",

description:"Reach 2048."

},

{

id:"developer",

title:"💻 Developer Explorer",

description:"Play every Developer Lab challenge."

}

];

const player = JSON.parse(localStorage.getItem("player"));

const container = document.getElementById("achievementContainer");

achievementList.forEach(item=>{

const unlocked = player.achievements.includes(item.id);

container.innerHTML +=`

<div class="achievement-card">

<h3>${unlocked ? "✅":"🔒"} ${item.title}</h3>

<p>${item.description}</p>

</div>

`;

});
let player = JSON.parse(localStorage.getItem("player"));

if(!player.achievements.includes("snake_master")){

player.achievements.push("snake_master");

}

localStorage.setItem("player",JSON.stringify(player));

let player = JSON.parse(localStorage.getItem("player"));

if(!player.achievements.includes("first_game")){

player.achievements.push("first_game");

}

localStorage.setItem("player",JSON.stringify(player));