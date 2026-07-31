"use strict";

/* =========================================================
   CHAOS BUTTON
   CodeQuest Arena
   ========================================================= */

const challenges = [

  // DSA
  {
    category: "dsa",
    difficulty: 1,
    title: "Array Logic",
    text: "Given an array of integers, find the second largest element without sorting the array."
  },

  {
    category: "dsa",
    difficulty: 2,
    title: "Two Sum",
    text: "Solve the Two Sum problem using a HashMap and explain why the solution runs in O(n) time."
  },

  {
    category: "dsa",
    difficulty: 3,
    title: "Sliding Window",
    text: "Find the length of the longest substring without repeating characters using the sliding window technique."
  },

  // Frontend
  {
    category: "frontend",
    difficulty: 1,
    title: "CSS Challenge",
    text: "Create a responsive card layout using CSS Grid that automatically changes from four columns to one column on mobile."
  },

  {
    category: "frontend",
    difficulty: 2,
    title: "DOM Challenge",
    text: "Build a JavaScript search box that filters a list of cards instantly as the user types."
  },

  {
    category: "frontend",
    difficulty: 3,
    title: "Performance",
    text: "Explain three ways you would improve the performance of a large JavaScript application containing hundreds of DOM elements."
  },

  // Backend
  {
    category: "backend",
    difficulty: 1,
    title: "API Basics",
    text: "Explain the difference between GET, POST, PUT and DELETE HTTP methods."
  },

  {
    category: "backend",
    difficulty: 2,
    title: "REST API",
    text: "Design REST endpoints for a simple task-management application."
  },

  {
    category: "backend",
    difficulty: 3,
    title: "Authentication",
    text: "Explain how JWT-based authentication works from login to accessing a protected API route."
  },

  // Debug
  {
    category: "debug",
    difficulty: 1,
    title: "Find the Bug",
    text: "A button click handler is not working. Inspect the event listener logic and identify the most likely causes."
  },

  {
    category: "debug",
    difficulty: 2,
    title: "Async Debugging",
    text: "A fetch request sometimes returns undefined data. Explain how you would debug the asynchronous JavaScript flow."
  },

  {
    category: "debug",
    difficulty: 3,
    title: "Race Condition",
    text: "Two asynchronous API requests update the same UI element. Explain how a race condition could occur and how you would prevent it."
  },

  // System
  {
    category: "system",
    difficulty: 2,
    title: "URL Shortener",
    text: "Design the basic architecture of a URL-shortening service that can handle millions of requests."
  },

  {
    category: "system",
    difficulty: 3,
    title: "Scalability",
    text: "Explain how load balancing and caching can improve the scalability of a web application."
  },

  // Git
  {
    category: "git",
    difficulty: 1,
    title: "Git Recovery",
    text: "You accidentally deleted a local commit. Explain how git reflog can help you recover it."
  },

  {
    category: "git",
    difficulty: 2,
    title: "Merge Conflict",
    text: "Explain the correct steps to resolve a Git merge conflict and safely commit the resolved files."
  },

  {
    category: "git",
    difficulty: 3,
    title: "Git Strategy",
    text: "Design a Git branching strategy for a team of developers working on a production web application."
  }
];


/* =========================================================
   STATE
   ========================================================= */

const STORAGE_KEY = "codequest-chaos-stats";

let currentCategory = "all";
let currentChallenge = null;
let timerInterval = null;
let timerValue = 30;

let stats = {
  completed: 0,
  skipped: 0,
  currentStreak: 0,
  bestStreak: 0,
  history: []
};


/* =========================================================
   DOM
   ========================================================= */

const chaosBtn = document.getElementById("chaosBtn");

const challengeCard = document.getElementById("challengeCard");
const challengeText = document.getElementById("challengeText");

const catBadge = document.getElementById("catBadge");

const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");

const diffLabel = document.getElementById("diffLabel");

const outcomeRow = document.getElementById("outcomeRow");

const surviveBtn = document.getElementById("surviveBtn");
const retryBtn = document.getElementById("retryBtn");
const skipBtn = document.getElementById("skipBtn");

const idleHint = document.getElementById("idleHint");

const survivedStat = document.getElementById("survivedStat");
const skippedStat = document.getElementById("skippedStat");
const streakStat = document.getElementById("streakStat");

const filterRow = document.getElementById("filterRow");

const copyBtn = document.getElementById("copyBtn");

const timerToggleBtn = document.getElementById("timerToggleBtn");
const timerDisplay = document.getElementById("timerDisplay");
const timerCount = document.getElementById("timerCount");

const historySection = document.getElementById("historySection");
const historyList = document.getElementById("historyList");


/* =========================================================
   LOAD SAVED DATA
   ========================================================= */

function loadStats() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const parsed = JSON.parse(saved);

    stats = {
      ...stats,
      ...parsed
    };

  } catch (error) {

    console.warn("Could not load Chaos Button data.", error);

  }

}


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveStats() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stats)
    );

  } catch (error) {

    console.warn("Could not save Chaos Button data.", error);

  }

}


/* =========================================================
   UPDATE STATS
   ========================================================= */

function updateStats() {

  survivedStat.textContent = stats.completed;
  skippedStat.textContent = stats.skipped;
  streakStat.textContent = stats.bestStreak;

}


/* =========================================================
   CATEGORY NAME
   ========================================================= */

function categoryName(category) {

  const names = {
    dsa: "DSA",
    frontend: "Frontend",
    backend: "Backend",
    debug: "Debug",
    system: "System",
    git: "Git"
  };

  return names[category] || category;

}


/* =========================================================
   DIFFICULTY
   ========================================================= */

function updateDifficulty(level) {

  const dots = [d1, d2, d3];

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index < level
    );

  });

  const labels = {
    1: "Easy",
    2: "Medium",
    3: "Hard"
  };

  diffLabel.textContent =
    labels[level] || "Unknown";

}


/* =========================================================
   FILTER CHALLENGES
   ========================================================= */

function getAvailableChallenges() {

  if (currentCategory === "all") {

    return challenges;

  }

  return challenges.filter(
    challenge =>
      challenge.category === currentCategory
  );

}


/* =========================================================
   RANDOM CHALLENGE
   ========================================================= */

function getRandomChallenge() {

  const available = getAvailableChallenges();

  if (!available.length) {

    return null;

  }

  /*
   * Prevent the exact same challenge from appearing
   * twice consecutively when possible.
   */

  let candidates = available;

  if (available.length > 1 && currentChallenge) {

    candidates = available.filter(
      challenge =>
        challenge.text !== currentChallenge.text
    );

  }

  const randomIndex =
    Math.floor(Math.random() * candidates.length);

  return candidates[randomIndex];

}


/* =========================================================
   DISPLAY CHALLENGE
   ========================================================= */

function displayChallenge(challenge) {

  if (!challenge) return;

  currentChallenge = challenge;

  challengeText.textContent =
    challenge.text;

  catBadge.textContent =
    categoryName(challenge.category);

  updateDifficulty(
    challenge.difficulty
  );

  challengeCard.classList.remove("hidden");

  idleHint.classList.add("hidden");

  outcomeRow.classList.remove("hidden");

  chaosBtn.classList.add("active");

  stopTimer();

  timerDisplay.classList.add("hidden");

  timerValue = 30;

  timerCount.textContent = timerValue;

}


/* =========================================================
   UNLEASH CHAOS
   ========================================================= */

function unleashChaos() {

  const challenge =
    getRandomChallenge();

  if (!challenge) return;

  displayChallenge(challenge);

  addHistory(
    challenge,
    "generated"
  );

  chaosBtn.classList.add("pulse");

  setTimeout(() => {

    chaosBtn.classList.remove("pulse");

  }, 500);

}


/* =========================================================
   SURVIVE
   ========================================================= */

function surviveChallenge() {

  if (!currentChallenge) return;

  stats.completed++;

  stats.currentStreak++;

  if (
    stats.currentStreak >
    stats.bestStreak
  ) {

    stats.bestStreak =
      stats.currentStreak;

  }

  addHistory(
    currentChallenge,
    "completed"
  );

  saveStats();

  updateStats();

  showFeedback(
    "🔥 Challenge survived! +XP"
  );

  generateNextChallenge();

}


/* =========================================================
   SKIP
   ========================================================= */

function skipChallenge() {

  if (!currentChallenge) return;

  stats.skipped++;

  stats.currentStreak = 0;

  addHistory(
    currentChallenge,
    "skipped"
  );

  saveStats();

  updateStats();

  showFeedback(
    "💀 Challenge skipped. Streak reset."
  );

  generateNextChallenge();

}


/* =========================================================
   TRY AGAIN
   ========================================================= */

function retryChallenge() {

  const challenge =
    getRandomChallenge();

  if (!challenge) return;

  displayChallenge(challenge);

  addHistory(
    challenge,
    "retry"
  );

}


/* =========================================================
   NEXT CHALLENGE
   ========================================================= */

function generateNextChallenge() {

  const challenge =
    getRandomChallenge();

  if (!challenge) return;

  displayChallenge(challenge);

}


/* =========================================================
   COPY
   ========================================================= */

async function copyChallenge() {

  if (!currentChallenge) return;

  const text =
    `${categoryName(currentChallenge.category)} — ${currentChallenge.text}`;

  try {

    await navigator.clipboard.writeText(text);

    showFeedback(
      "📋 Challenge copied!"
    );

  } catch (error) {

    /*
     * Fallback for browsers where
     * Clipboard API isn't available.
     */

    const textarea =
      document.createElement("textarea");

    textarea.value = text;

    document.body.appendChild(textarea);

    textarea.select();

    document.execCommand("copy");

    textarea.remove();

    showFeedback(
      "📋 Challenge copied!"
    );

  }

}


/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {

  if (!currentChallenge) return;

  if (timerInterval) return;

  timerDisplay.classList.remove(
    "hidden"
  );

  timerToggleBtn.textContent = "⏸";

  timerInterval = setInterval(() => {

    timerValue--;

    timerCount.textContent =
      timerValue;

    if (timerValue <= 0) {

      stopTimer();

      showFeedback(
        "⏰ Time's up!"
      );

      timerCount.textContent = "0";

    }

  }, 1000);

}


function stopTimer() {

  if (timerInterval) {

    clearInterval(timerInterval);

    timerInterval = null;

  }

  timerToggleBtn.textContent = "⏱";

}


function toggleTimer() {

  if (!currentChallenge) return;

  if (timerInterval) {

    stopTimer();

    return;

  }

  if (timerValue <= 0) {

    timerValue = 30;

    timerCount.textContent =
      timerValue;

  }

  startTimer();

}


/* =========================================================
   HISTORY
   ========================================================= */

function addHistory(
  challenge,
  status
) {

  const item = {

    category: challenge.category,

    difficulty:
      challenge.difficulty,

    text:
      challenge.text,

    status,

    time:
      Date.now()

  };

  stats.history.unshift(item);

  /*
   * Keep the last 8 entries.
   */

  stats.history =
    stats.history.slice(0, 8);

  renderHistory();

  saveStats();

}


function renderHistory() {

  if (!stats.history.length) {

    historySection.classList.add(
      "hidden"
    );

    return;

  }

  historySection.classList.remove(
    "hidden"
  );

  historyList.innerHTML = "";

  stats.history.forEach(item => {

    const element =
      document.createElement("div");

    element.className =
      "history-item";

    const statusIcon = {

      completed: "✅",

      skipped: "💀",

      retry: "🔄",

      generated: "☄️"

    }[item.status] || "☄️";

    element.innerHTML = `

      <span class="history-icon">
        ${statusIcon}
      </span>

      <div class="history-content">

        <strong>
          ${escapeHTML(
            categoryName(item.category)
          )}
        </strong>

        <span>
          ${escapeHTML(item.text)}
        </span>

      </div>

    `;

    historyList.appendChild(
      element
    );

  });

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent = value;

  return div.innerHTML;

}


/* =========================================================
   FEEDBACK
   ========================================================= */

function showFeedback(message) {

  let feedback =
    document.getElementById(
      "chaosFeedback"
    );

  if (!feedback) {

    feedback =
      document.createElement("div");

    feedback.id =
      "chaosFeedback";

    feedback.className =
      "chaos-feedback";

    document.body.appendChild(
      feedback
    );

  }

  feedback.textContent =
    message;

  feedback.classList.add(
    "show"
  );

  clearTimeout(
    feedback.hideTimeout
  );

  feedback.hideTimeout =
    setTimeout(() => {

      feedback.classList.remove(
        "show"
      );

    }, 2200);

}


/* =========================================================
   FILTER BUTTONS
   ========================================================= */

filterRow.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".filter-btn"
      );

    if (!button) return;

    document
      .querySelectorAll(".filter-btn")
      .forEach(btn => {

        btn.classList.remove(
          "active"
        );

      });

    button.classList.add(
      "active"
    );

    currentCategory =
      button.dataset.cat;

    /*
     * If a challenge is currently
     * displayed, generate one
     * matching the new category.
     */

    if (!challengeCard.classList.contains("hidden")) {

      unleashChaos();

    }

  }
);


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

chaosBtn.addEventListener(
  "click",
  unleashChaos
);

surviveBtn.addEventListener(
  "click",
  surviveChallenge
);

retryBtn.addEventListener(
  "click",
  retryChallenge
);

skipBtn.addEventListener(
  "click",
  skipChallenge
);

copyBtn.addEventListener(
  "click",
  copyChallenge
);

timerToggleBtn.addEventListener(
  "click",
  toggleTimer
);


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
     * Space or Enter while not typing
     * triggers Chaos.
     */

    const tag =
      document.activeElement?.tagName;

    const isTyping =
      tag === "INPUT" ||
      tag === "TEXTAREA";

    if (isTyping) return;

    if (
      event.code === "Space" ||
      event.code === "Enter"
    ) {

      event.preventDefault();

      unleashChaos();

    }

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function initialize() {

  loadStats();

  updateStats();

  renderHistory();

  challengeCard.classList.add(
    "hidden"
  );

  outcomeRow.classList.add(
    "hidden"
  );

  idleHint.classList.remove(
    "hidden"
  );

}


initialize();