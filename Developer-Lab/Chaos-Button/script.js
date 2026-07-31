/* =========================================================
   CODEQUEST ARENA
   CHAOS MODE
   Interactive Developer Challenges
========================================================= */

const challenges = [

  /* ================= DSA ================= */

  {
    category: "dsa",
    categoryName: "DSA",
    difficulty: "Easy",
    xp: 25,
    title: "Find the Missing Number",
    description:
      "One number from 1 to 6 is missing. Find the missing number.",
    type: "input",
    data: {
      numbers: [4, 1, 6, 2, 5],
      answer: "3"
    }
  },

  {
    category: "dsa",
    categoryName: "DSA",
    difficulty: "Easy",
    xp: 25,
    title: "Reverse the String",
    description:
      "Reverse the following string and enter your answer.",
    type: "input",
    data: {
      value: "CODEQUEST",
      answer: "TSEUQEDOC"
    }
  },

  {
    category: "dsa",
    categoryName: "DSA",
    difficulty: "Medium",
    xp: 50,
    title: "Two Sum",
    description:
      "Which two numbers add up to the target value 9?",
    type: "options",
    data: {
      options: [
        "[2, 7]",
        "[3, 5]",
        "[1, 6]",
        "[4, 4]"
      ],
      answer: 0
    }
  },

  {
    category: "dsa",
    categoryName: "DSA",
    difficulty: "Medium",
    xp: 50,
    title: "Array Complexity",
    description:
      "What is the time complexity of binary search on a sorted array?",
    type: "options",
    data: {
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      answer: 1
    }
  },

  /* ================= FRONTEND ================= */

  {
    category: "frontend",
    categoryName: "Frontend",
    difficulty: "Easy",
    xp: 25,
    title: "CSS Selector",
    description:
      "Which CSS property creates rounded corners?",
    type: "options",
    data: {
      options: [
        "corner-radius",
        "border-radius",
        "radius",
        "round-border"
      ],
      answer: 1
    }
  },

  {
    category: "frontend",
    categoryName: "Frontend",
    difficulty: "Medium",
    xp: 50,
    title: "Flexbox Alignment",
    description:
      "Which property centers items along the main axis in Flexbox?",
    type: "options",
    data: {
      options: [
        "align-items",
        "justify-content",
        "text-align",
        "place-content"
      ],
      answer: 1
    }
  },

  {
    category: "frontend",
    categoryName: "Frontend",
    difficulty: "Easy",
    xp: 25,
    title: "JavaScript Output",
    description:
      "What will this JavaScript code print?",
    type: "options",
    data: {
      code:
`let x = 5;
let y = 2;

console.log(x + y);`,
      options: [
        "52",
        "7",
        "10",
        "3"
      ],
      answer: 1
    }
  },

  /* ================= DEBUG ================= */

  {
    category: "debug",
    categoryName: "Debug",
    difficulty: "Medium",
    xp: 50,
    title: "Find the Bug",
    description:
      "Identify the problem in this JavaScript function.",
    type: "options",
    data: {
      code:
`function calculateTotal(price, quantity) {
    return price + quantity;
}`,
      options: [
        "Missing semicolon",
        "Should multiply price × quantity",
        "quantity must be a string",
        "There is no bug"
      ],
      answer: 1
    }
  },

  {
    category: "debug",
    categoryName: "Debug",
    difficulty: "Hard",
    xp: 75,
    title: "Loop Debugging",
    description:
      "Why does this loop never stop?",
    type: "options",
    data: {
      code:
`let i = 0;

while (i < 5) {
    console.log(i);
}`,
      options: [
        "i is never incremented",
        "while cannot be used",
        "console.log is invalid",
        "The condition is wrong"
      ],
      answer: 0
    }
  },

  /* ================= GIT ================= */

  {
    category: "git",
    categoryName: "Git",
    difficulty: "Easy",
    xp: 25,
    title: "Create a Branch",
    description:
      "Which command creates a new Git branch?",
    type: "options",
    data: {
      options: [
        "git push new-feature",
        "git branch new-feature",
        "git merge new-feature",
        "git pull new-feature"
      ],
      answer: 1
    }
  },

  {
    category: "git",
    categoryName: "Git",
    difficulty: "Medium",
    xp: 50,
    title: "Check Repository Status",
    description:
      "Which command shows modified and untracked files?",
    type: "options",
    data: {
      options: [
        "git log",
        "git status",
        "git branch",
        "git diff --name-only"
      ],
      answer: 1
    }
  },

  /* ================= BACKEND ================= */

  {
    category: "backend",
    categoryName: "Backend",
    difficulty: "Medium",
    xp: 50,
    title: "HTTP Status Code",
    description:
      "Which HTTP status code means 'Not Found'?",
    type: "options",
    data: {
      options: [
        "200",
        "201",
        "404",
        "500"
      ],
      answer: 2
    }
  },

  {
    category: "backend",
    categoryName: "Backend",
    difficulty: "Easy",
    xp: 25,
    title: "GET Request",
    description:
      "Which HTTP method is normally used to retrieve data?",
    type: "options",
    data: {
      options: [
        "GET",
        "POST",
        "PUT",
        "DELETE"
      ],
      answer: 0
    }
  },

  /* ================= SYSTEM ================= */

  {
    category: "system",
    categoryName: "System",
    difficulty: "Medium",
    xp: 50,
    title: "Load Balancer",
    description:
      "What is the main purpose of a load balancer?",
    type: "options",
    data: {
      options: [
        "Store passwords",
        "Distribute traffic across servers",
        "Compile JavaScript",
        "Create database tables"
      ],
      answer: 1
    }
  },

  {
    category: "system",
    categoryName: "System",
    difficulty: "Hard",
    xp: 75,
    title: "Caching",
    description:
      "What is the main benefit of caching frequently requested data?",
    type: "options",
    data: {
      options: [
        "Increase database load",
        "Reduce repeated expensive operations",
        "Delete old data",
        "Disable networking"
      ],
      answer: 1
    }
  }

];

/* =========================================================
   STATE
========================================================= */

let selectedCategory = "all";
let currentChallenge = null;
let selectedOption = null;

let timer = null;
let timeLeft = 45;

let xp = Number(localStorage.getItem("chaosXP")) || 0;
let streak = Number(localStorage.getItem("chaosStreak")) || 0;
let completed = Number(localStorage.getItem("chaosCompleted")) || 0;
let skipped = Number(localStorage.getItem("chaosSkipped")) || 0;

let recent =
  JSON.parse(localStorage.getItem("chaosRecent")) || [];

/* =========================================================
   ELEMENTS
========================================================= */

const categoryButtons =
  document.querySelectorAll(".category-btn");

const generateBtn =
  document.getElementById("generateBtn");

const chaosCore =
  document.getElementById("chaosCore");

const challengeSection =
  document.getElementById("challengeSection");

const categoryBadge =
  document.getElementById("categoryBadge");

const difficultyBadge =
  document.getElementById("difficultyBadge");

const xpReward =
  document.getElementById("xpReward");

const timerDisplay =
  document.getElementById("timerDisplay");

const challengeTitle =
  document.getElementById("challengeTitle");

const challengeDescription =
  document.getElementById("challengeDescription");

const challengeWorkspace =
  document.getElementById("challengeWorkspace");

const resultMessage =
  document.getElementById("resultMessage");

const submitBtn =
  document.getElementById("submitBtn");

const skipBtn =
  document.getElementById("skipBtn");

const xpStat =
  document.getElementById("xpStat");

const streakStat =
  document.getElementById("streakStat");

const completedStat =
  document.getElementById("completedStat");

const skippedStat =
  document.getElementById("skippedStat");

const recentList =
  document.getElementById("recentList");

/* =========================================================
   CATEGORY FILTER
========================================================= */

categoryButtons.forEach(button => {

  button.addEventListener("click", () => {

    categoryButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    selectedCategory =
      button.dataset.category;

  });

});

/* =========================================================
   GENERATE
========================================================= */

generateBtn.addEventListener(
  "click",
  generateChallenge
);

function generateChallenge() {

  clearInterval(timer);

  selectedOption = null;

  resultMessage.className =
    "result-message hidden";

  resultMessage.textContent = "";

  const available =
    selectedCategory === "all"
      ? challenges
      : challenges.filter(
          challenge =>
            challenge.category === selectedCategory
        );

  if (!available.length) return;

  currentChallenge =
    available[
      Math.floor(Math.random() * available.length)
    ];

  chaosCore.classList.add("generating");

  generateBtn.disabled = true;

  setTimeout(() => {

    chaosCore.classList.remove("generating");

    renderChallenge();

    generateBtn.disabled = false;

  }, 800);

}

/* =========================================================
   RENDER CHALLENGE
========================================================= */

function renderChallenge() {

  challengeSection.classList.remove("hidden");

  categoryBadge.textContent =
    currentChallenge.categoryName.toUpperCase();

  difficultyBadge.textContent =
    currentChallenge.difficulty.toUpperCase();

  xpReward.textContent =
    `+${currentChallenge.xp} XP`;

  challengeTitle.textContent =
    currentChallenge.title;

  challengeDescription.textContent =
    currentChallenge.description;

  renderWorkspace();

  startTimer();

  challengeSection.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}

/* =========================================================
   WORKSPACE
========================================================= */

function renderWorkspace() {

  challengeWorkspace.innerHTML = "";

  const data =
    currentChallenge.data;

  /* INPUT */

  if (currentChallenge.type === "input") {

    if (data.numbers) {

      const numbers =
        document.createElement("div");

      numbers.className = "code-block";

      numbers.textContent =
        `[ ${data.numbers.join(", ")} , ? ]`;

      challengeWorkspace.appendChild(numbers);

    }

    if (data.value) {

      const code =
        document.createElement("div");

      code.className = "code-block";

      code.textContent =
        data.value;

      challengeWorkspace.appendChild(code);

    }

    const input =
      document.createElement("input");

    input.className =
      "answer-input";

    input.id =
      "answerInput";

    input.placeholder =
      "Enter your answer...";

    challengeWorkspace.appendChild(input);

    return;
  }

  /* OPTIONS */

  if (currentChallenge.type === "options") {

    if (data.code) {

      const code =
        document.createElement("pre");

      code.className =
        "code-block";

      code.textContent =
        data.code;

      challengeWorkspace.appendChild(code);

    }

    const optionGrid =
      document.createElement("div");

    optionGrid.className =
      "option-grid";

    data.options.forEach(
      (option, index) => {

        const button =
          document.createElement("button");

        button.className =
          "option-btn";

        button.textContent =
          option;

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(".option-btn")
              .forEach(btn =>
                btn.classList.remove("selected")
              );

            button.classList.add("selected");

            selectedOption = index;

          }
        );

        optionGrid.appendChild(button);

      }
    );

    challengeWorkspace.appendChild(
      optionGrid
    );

  }

}

/* =========================================================
   TIMER
========================================================= */

function startTimer() {

  clearInterval(timer);

  timeLeft = 45;

  updateTimer();

  timer =
    setInterval(() => {

      timeLeft--;

      updateTimer();

      if (timeLeft <= 0) {

        clearInterval(timer);

        showResult(
          false,
          "⏱ Time's up! Chaos wins this round."
        );

        submitBtn.disabled = true;

      }

    }, 1000);

}

function updateTimer() {

  timerDisplay.textContent =
    `⏱ ${timeLeft}s`;

  if (timeLeft <= 10) {

    timerDisplay.style.color =
      "#fb7185";

  } else {

    timerDisplay.style.color =
      "";

  }

}

/* =========================================================
   SUBMIT
========================================================= */

submitBtn.addEventListener(
  "click",
  checkAnswer
);

function checkAnswer() {

  if (!currentChallenge) return;

  let correct = false;

  if (currentChallenge.type === "input") {

    const input =
      document.getElementById(
        "answerInput"
      );

    if (!input) return;

    const userAnswer =
      input.value
        .trim()
        .toUpperCase();

    correct =
      userAnswer ===
      currentChallenge.data.answer
        .toUpperCase();

  }

  if (currentChallenge.type === "options") {

    if (selectedOption === null) {

      showResult(
        false,
        "⚠️ Select an answer first."
      );

      return;

    }

    correct =
      selectedOption ===
      currentChallenge.data.answer;

    document
      .querySelectorAll(".option-btn")
      .forEach((button, index) => {

        if (
          index ===
          currentChallenge.data.answer
        ) {

          button.classList.add(
            "correct"
          );

        }

        if (
          index === selectedOption &&
          !correct
        ) {

          button.classList.add(
            "wrong"
          );

        }

      });

  }

  clearInterval(timer);

  if (correct) {

    completed++;

    streak++;

    xp += currentChallenge.xp;

    saveState();

    updateStats();

    showResult(
      true,
      `🎉 Correct! +${currentChallenge.xp} XP`
    );

    addRecent(
      currentChallenge,
      true
    );

    submitBtn.disabled = true;

  } else {

    streak = 0;

    saveState();

    updateStats();

    showResult(
      false,
      "❌ Not quite. Try the next challenge."
    );

    addRecent(
      currentChallenge,
      false
    );

  }

}

/* =========================================================
   RESULT
========================================================= */

function showResult(
  success,
  message
) {

  resultMessage.className =
    `result-message ${
      success
        ? "success"
        : "error"
    }`;

  resultMessage.textContent =
    message;

}

/* =========================================================
   SKIP
========================================================= */

skipBtn.addEventListener(
  "click",
  () => {

    if (!currentChallenge) return;

    clearInterval(timer);

    skipped++;

    streak = 0;

    saveState();

    updateStats();

    addRecent(
      currentChallenge,
      false,
      true
    );

    showResult(
      false,
      "💀 Challenge skipped. Chaos continues..."
    );

    submitBtn.disabled = false;

  }
);

/* =========================================================
   RECENT
========================================================= */

function addRecent(
  challenge,
  success,
  wasSkipped = false
) {

  recent.unshift({

    title:
      challenge.title,

    category:
      challenge.categoryName,

    success,

    skipped: wasSkipped,

    time:
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )

  });

  recent =
    recent.slice(0, 6);

  localStorage.setItem(
    "chaosRecent",
    JSON.stringify(recent)
  );

  renderRecent();

}

function renderRecent() {

  if (!recent.length) {

    recentList.innerHTML = `
      <div class="empty-state">
        No challenges yet.<br>
        Generate your first chaos.
      </div>
    `;

    return;

  }

  recentList.innerHTML =
    recent.map(item => {

      let icon =
        item.skipped
          ? "💀"
          : item.success
            ? "✅"
            : "❌";

      return `
        <div class="recent-item">

          <span>
            ${icon}
            ${escapeHTML(item.title)}
          </span>

          <small>
            ${item.category}
            • ${item.time}
          </small>

        </div>
      `;

    }).join("");

}

/* =========================================================
   STATS
========================================================= */

function updateStats() {

  xpStat.textContent =
    xp;

  streakStat.textContent =
    streak;

  completedStat.textContent =
    completed;

  skippedStat.textContent =
    skipped;

}

function saveState() {

  localStorage.setItem(
    "chaosXP",
    xp
  );

  localStorage.setItem(
    "chaosStreak",
    streak
  );

  localStorage.setItem(
    "chaosCompleted",
    completed
  );

  localStorage.setItem(
    "chaosSkipped",
    skipped
  );

}

/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}

/* =========================================================
   INIT
========================================================= */

updateStats();

renderRecent();