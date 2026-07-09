/**
 * CodeQuest Arena - Main Platform Engine
 * Architecture: State-Driven UI Management
 */

// ==========================================
// 1. INITIAL STATE & CONFIGURATION
// ==========================================
const DEFAULT_STATE = {
    level: 1,
    xp: 35,
    xpNeeded: 100,
    gamesPlayed: 12,
    streak: 7,
    favorites: [] // Array of game IDs
};

// Mock Achievements Data
const ACHIEVEMENTS_DATA = [
    { id: 'first_blood', title: 'Code Rookie', desc: 'Launch your first game inside the arena.', xp: 25, icon: '🚀', unlocked: true },
    { id: 'lucky_guess', title: 'Binary Searcher', desc: 'Win a Number Guessing game in under 5 tries.', xp: 50, icon: '🎯', unlocked: true },
    { id: 'survior', title: 'Anaconda Vibe', desc: 'Reach a length of 50 in Snake Game.', xp: 100, icon: '🐍', unlocked: false },
    { id: 'bug_squasher', title: 'Exorcist', desc: 'Find all bugs in Bug Hunter under 30 seconds.', xp: 75, icon: '🐞', unlocked: false }
];

let gameState = JSON.parse(localStorage.getItem('cqa_state')) || { ...DEFAULT_STATE };

// ==========================================
// 2. DOM ELEMENT SELECTORS
// ==========================================
const DOM = {
    themeToggle: document.getElementById('themeToggle'),
    htmlTag: document.documentElement,
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    noResults: document.getElementById('noResults'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    gameCards: document.querySelectorAll('.game-card'),
    favBtns: document.querySelectorAll('.fav-btn'),
    
    // Dashboard Stats
    levelNum: document.getElementById('levelNum'),
    playerTitle: document.getElementById('playerTitle'),
    xpFill: document.getElementById('xpFill'),
    xpVal: document.getElementById('xpVal'),
    gamesPlayedCount: document.getElementById('gamesPlayedCount'),
    favCount: document.getElementById('favCount'),
    achieveCount: document.getElementById('achieveCount'),
    streakCount: document.getElementById('streakCount'),
    
    // Core Containers & Overlays
    achievementContainer: document.getElementById('achievementContainer'),
    toast: document.getElementById('toast'),
    achievementPopup: document.getElementById('achievementPopup'),
    popupTitle: document.getElementById('popupTitle'),
    popupXP: document.getElementById('popupXP')
};

// ==========================================
// 3. PLATFORM CORE INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderDashboard();
    renderAchievements();
    updateFilterCounts();
    setupEventListeners();
});

// ==========================================
// 4. THEME ENGINE
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('cqa_theme') || 'dark';
    DOM.htmlTag.setAttribute('data-theme', savedTheme);
    DOM.themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
    const currentTheme = DOM.htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    DOM.htmlTag.setAttribute('data-theme', newTheme);
    DOM.themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('cqa_theme', newTheme);
    showToast(`Switched to ${newTheme} mode!`);
}

// ==========================================
// 5. DASHBOARD & RENDER ENGINE
// ==========================================
function renderDashboard() {
    // Update simple typography tokens
    DOM.levelNum.textContent = gameState.level;
    DOM.gamesPlayedCount.textContent = gameState.gamesPlayed;
    DOM.streakCount.textContent = gameState.streak;
    DOM.favCount.textContent = gameState.favorites.length;
    
    // Calculate Rank Title
    if (gameState.level >= 10) DOM.playerTitle.textContent = "Grandmaster";
    else if (gameState.level >= 5) DOM.playerTitle.textContent = "Script Wizard";
    else DOM.playerTitle.textContent = "Explorer";

    // Update Progress Bar
    const xpPercentage = (gameState.xp / gameState.xpNeeded) * 100;
    DOM.xpFill.style.width = `${xpPercentage}%`;
    DOM.xpVal.textContent = `${gameState.xp} / ${gameState.xpNeeded} XP`;

    // Sync favorite heart UI states on cards
    DOM.gameCards.forEach(card => {
        const id = card.getAttribute('data-id');
        const btn = card.querySelector('.fav-btn');
        if (gameState.favorites.includes(id)) {
            btn.innerHTML = '❤️';
            btn.classList.add('active');
        } else {
            btn.innerHTML = '♡';
            btn.classList.remove('active');
        }
    });
}

function renderAchievements() {
    if (!DOM.achievementContainer) return;
    
    DOM.achievementContainer.innerHTML = '';
    let unlockedCounter = 0;

    ACHIEVEMENTS_DATA.forEach(ach => {
        if (ach.unlocked) unlockedCounter++;
        
        const card = document.createElement('div');
        card.className = `achieve-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="ach-icon">${ach.icon}</div>
            <div class="ach-info">
                <h4>${ach.title}</h4>
                <p>${ach.desc}</p>
                <span class="ach-xp">+${ach.xp} XP</span>
            </div>
        `;
        DOM.achievementContainer.appendChild(card);
    });

    DOM.achieveCount.textContent = unlockedCounter;
}

// ==========================================
// 6. FILTER & SEARCH ARCHITECTURE
// ==========================================
function filterAndSearch() {
    const query = DOM.searchInput.value.toLowerCase().trim();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    // Show/Hide search clear utility button
    if (query.length > 0) {
        DOM.searchClear.classList.remove('hidden');
    } else {
        DOM.searchClear.classList.add('hidden');
    }

    let visibleCount = 0;

    DOM.gameCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        const categories = card.getAttribute('data-category').split(' ');
        const id = card.getAttribute('data-id');

        const matchesSearch = name.includes(query);
        let matchesFilter = false;

        if (currentFilter === 'all') {
            matchesFilter = true;
        } else if (currentFilter === 'developer') {
            matchesFilter = categories.includes('developer');
        } else {
            // Evaluates targeted custom tags like 'logic', 'arcade', 'memory'
            matchesFilter = categories.includes(currentFilter);
        }

        // Special evaluation context for "Games" filter option specifically
        if (currentFilter === 'games' && (categories.includes('logic') || categories.includes('arcade') || categories.includes('memory'))) {
            matchesFilter = true;
        }

        if (matchesSearch && matchesFilter) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Handle empty state validation
    if (visibleCount === 0) {
        DOM.noResults.classList.remove('hidden');
    } else {
        DOM.noResults.classList.add('hidden');
    }
}

function updateFilterCounts() {
    const counts = { all: 0, games: 0, developer: 0, logic: 0, arcade: 0, memory: 0 };
    
    DOM.gameCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        counts.all++;
        
        categories.forEach(cat => {
            if (counts[cat] !== undefined) counts[cat]++;
        });

        if (categories.includes('logic') || categories.includes('arcade') || categories.includes('memory')) {
            counts.games++;
        }
    });

    // Write numbers directly inside the target spans safely
    for (const key in counts) {
        const counterSpan = document.getElementById(`fc-${key}`);
        if (counterSpan) counterSpan.textContent = `(${counts[key]})`;
    }
}

// ==========================================
// 7. INTERACTION & MUTATION EVENTS
// ==========================================
function setupEventListeners() {
    // Theme Click Event
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Live Input Tracking for Search
    DOM.searchInput.addEventListener('input', filterAndSearch);
    
    DOM.searchClear.addEventListener('click', () => {
        DOM.searchInput.value = '';
        filterAndSearch();
        DOM.searchInput.focus();
    });

    // Filter Buttons Engine Setup
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSearch();
        });
    });

    // Favorites Interaction Engine (Using event containment on internal child button layers)
    DOM.gameCards.forEach(card => {
        const favBtn = card.querySelector('.fav-btn');
        const id = card.getAttribute('data-id');

        favBtn.addEventListener('click', (e) => {
            e.preventDefault(); // HALT parent anchor navigation route string!
            e.stopPropagation(); // Shield propagation bubble upward

            toggleFavorite(id);
        });
    });
}

function toggleFavorite(id) {
    const index = gameState.favorites.indexOf(id);
    if (index === -1) {
        gameState.favorites.push(id);
        showToast("Added target to favorites selection bucket! ❤️");
    } else {
        gameState.favorites.splice(index, 1);
        showToast("Removed target from favorites tracking database. ♡");
    }
    
    saveState();
    renderDashboard();
}

// ==========================================
// 8. NOTIFICATION & SYSTEM POPUP PIPELINE
// ==========================================
function showToast(message) {
    DOM.toast.textContent = message;
    DOM.toast.classList.add('show');
    
    setTimeout(() => {
        DOM.toast.classList.remove('show');
    }, 3000);
}

// Global System Event: Call this programmatically when your mini-games trigger an achievement drop
function triggerAchievementUnlock(id) {
    const achievement = ACHIEVEMENTS_DATA.find(ach => ach.id === id);
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    gameState.xp += achievement.xp;

    // Check for level up condition block
    if (gameState.xp >= gameState.xpNeeded) {
        gameState.level += 1;
        gameState.xp -= gameState.xpNeeded;
        setTimeout(() => showToast(`🎉 LEVEL UP! You reached Level ${gameState.level}!`), 1500);
    }

    saveState();
    renderDashboard();
    renderAchievements();

    // Trigger UI slide-in popup overlay container elements
    DOM.popupTitle.textContent = achievement.title;
    DOM.popupXP.textContent = `+${achievement.xp} XP Added`;
    DOM.achievementPopup.classList.remove('hidden');
    DOM.achievementPopup.classList.add('slide-in');

    setTimeout(() => {
        DOM.achievementPopup.classList.remove('slide-in');
        DOM.achievementPopup.classList.add('hidden');
    }, 5000);
}

function saveState() {
    localStorage.setItem('cqa_state', JSON.stringify(gameState));
}