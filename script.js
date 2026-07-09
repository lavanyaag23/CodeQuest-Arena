/* ================================================================
   FUN GAMES COLLECTION — script.js
   ✅ Dark/light theme (persisted)
   ✅ Favorite games (❤️ button, persisted, favorites row)
   ✅ Recently played (tracked on card click, persisted)
   ✅ XP + Level system (earn XP on play, fav, achievements)
   ✅ Achievements (auto-unlocked based on actions)
   ✅ Search (live, clears, highlights)
   ✅ Filter by category (with live counts)
   ✅ Toast notifications
   ✅ Floating XP pop labels
   ✅ Card entrance animations
   ✅ All data in localStorage
   ================================================================ */

'use strict';

/* ── STORAGE KEYS ─────────────────────────────────────────────── */
const K = {
  theme:   'fgc_theme',
  favs:    'fgc_favs',
  recent:  'fgc_recent',
  xp:      'fgc_xp',
  level:   'fgc_level',
  played:  'fgc_played',
  achieve: 'fgc_achievements',
};

function ls(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

/* ── GAME METADATA (matches data-id in HTML) ──────────────────── */
const GAMES = {
  numguess:      { name: 'Number Guessing', icon: '🎯', href: 'Number-Guessing-Game/' },
  rps:           { name: 'Rock Paper Scissors', icon: '✂️', href: 'Rock-Paper-Scissors/' },
  snake:         { name: 'Snake Game', icon: '🐍', href: 'Snake-Game/' },
  memory:        { name: 'Memory Card', icon: '🧠', href: 'Memory-Card-Game/' },
  simon:         { name: 'Simon Says', icon: '🎵', href: 'Simon-Says-Game/' },
  whack:         { name: 'Whack-A-Mole', icon: '⚡', href: 'Whack-A-Mole/' },
  '2048':        { name: '2048 Game', icon: '🎮', href: '2048-Game/' },
  bughunter:     { name: 'Bug Hunter', icon: '🐞', href: 'Developer-Lab/Bug-Hunter/index.html' },
  debugcode:     { name: 'Debug The Code', icon: '🐛', href: 'Developer-Lab/Debug-The-Code/index.html' },
  commitpredictor:{ name: 'Commit Predictor', icon: '🔮', href: 'Developer-Lab/Commit-Predictor/index.html' },
  chaos:         { name: 'Chaos Button', icon: '☄️', href: 'Developer-Lab/Chaos-Button/index.html' },
  cosmic:        { name: 'Cosmic Coder', icon: '🌌', href: 'Developer-Lab/Cosmic-Coder-Generator/index.html' },
  destiny:       { name: 'Developer Destiny', icon: '🔥', href: 'Developer-Lab/Developer-Destiny/index.html' },
};

/* ── ACHIEVEMENTS DEFINITIONS ─────────────────────────────────── */
const ACHIEVEMENTS = [
  { id: 'first_play',   icon: '🎮', name: 'First Launch',     desc: 'Played your first game',           xp: 20 },
  { id: 'play_3',       icon: '🔥', name: 'On a Roll',        desc: 'Played 3 different games',         xp: 30 },
  { id: 'play_5',       icon: '⭐', name: 'Game Hopper',       desc: 'Played 5 different games',         xp: 50 },
  { id: 'play_all',     icon: '🏅', name: 'Completionist',    desc: 'Visited all 13 games',             xp: 100 },
  { id: 'first_fav',   icon: '❤️', name: 'Bookmarked',        desc: 'Added your first favorite',        xp: 15 },
  { id: 'fav_3',       icon: '💜', name: 'Collector',         desc: 'Favorited 3 games',                xp: 30 },
  { id: 'explorer',    icon: '🧪', name: 'Lab Explorer',      desc: 'Visited a Developer Lab game',     xp: 25 },
  { id: 'level_5',     icon: '🚀', name: 'Rising Star',       desc: 'Reached Level 5',                  xp: 75 },
  { id: 'level_10',    icon: '🌟', name: 'Game Master',       desc: 'Reached Level 10',                 xp: 150 },
  { id: 'searcher',    icon: '🔍', name: 'The Searcher',      desc: 'Used the search bar',              xp: 10 },
  { id: 'night_owl',   icon: '🌙', name: 'Night Owl',         desc: 'Switched to dark mode',            xp: 10 },
  { id: 'day_bird',    icon: '☀️', name: 'Early Bird',        desc: 'Switched to light mode',           xp: 10 },
];

/* ── XP PER LEVEL ─────────────────────────────────────────────── */
const TITLES = [
  'Newcomer','Rookie','Explorer','Tinkerer','Builder',
  'Challenger','Strategist','Champion','Wizard','Game Master','Legend',
];
function xpForLevel(lvl) { return lvl * 100; }
function titleFor(lvl)   { return TITLES[Math.min(lvl - 1, TITLES.length - 1)]; }

/* ── STATE ────────────────────────────────────────────────────── */
let state = {
  theme:    ls(K.theme)   || 'dark',
  favs:     ls(K.favs)    || [],
  recent:   ls(K.recent)  || [],   // [{id, ts}]
  xp:       ls(K.xp)      || 0,
  level:    ls(K.level)   || 1,
  played:   ls(K.played)  || [],   // unique game ids visited
  achieve:  ls(K.achieve) || [],   // unlocked achievement ids
};

function save() {
  lsSet(K.theme,   state.theme);
  lsSet(K.favs,    state.favs);
  lsSet(K.recent,  state.recent);
  lsSet(K.xp,      state.xp);
  lsSet(K.level,   state.level);
  lsSet(K.played,  state.played);
  lsSet(K.achieve, state.achieve);
}

/* ── TOAST ────────────────────────────────────────────────────── */
let toastTimer;
function toast(msg, type = '') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = `toast ${type}`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ── XP FLOAT ────────────────────────────────────────────────── */
function floatXP(amount, anchorEl) {
  const el = document.createElement('div');
  el.className = 'xp-pop';
  el.textContent = `+${amount} XP`;
  const rect = anchorEl ? anchorEl.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2, width: 0 };
  el.style.left = (rect.left + rect.width / 2) + 'px';
  el.style.top  = (rect.top + window.scrollY - 10) + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/* ── XP + LEVEL ──────────────────────────────────────────────── */
function addXP(amount, anchor) {
  state.xp += amount;
  // level up loop
  let leveled = false;
  while (state.xp >= xpForLevel(state.level)) {
    state.xp -= xpForLevel(state.level);
    state.level++;
    leveled = true;
  }
  save();
  floatXP(amount, anchor);
  if (leveled) {
    toast(`🎉 Level Up! You're now Level ${state.level} — ${titleFor(state.level)}`, 'achieve');
    checkAchievement('level_5');
    checkAchievement('level_10');
  }
  renderProfile();
}

/* ── ACHIEVEMENTS ────────────────────────────────────────────── */
function checkAchievement(id) {
  if (state.achieve.includes(id)) return;
  const def = ACHIEVEMENTS.find(a => a.id === id);
  if (!def) return;

  // condition gates
  if (id === 'play_3'   && state.played.length < 3)  return;
  if (id === 'play_5'   && state.played.length < 5)  return;
  if (id === 'play_all' && state.played.length < Object.keys(GAMES).length) return;
  if (id === 'fav_3'    && state.favs.length < 3)    return;
  if (id === 'level_5'  && state.level < 5)           return;
  if (id === 'level_10' && state.level < 10)          return;

  state.achieve.push(id);
  save();
  toast(`🏆 Achievement: ${def.name}!`, 'achieve');
  addXP(def.xp);
  renderAchievements();
}

function checkAllAchievements() {
  if (state.played.length >= 1)  checkAchievement('first_play');
  if (state.played.length >= 3)  checkAchievement('play_3');
  if (state.played.length >= 5)  checkAchievement('play_5');
  checkAchievement('play_all');
  if (state.favs.length >= 1)    checkAchievement('first_fav');
  if (state.favs.length >= 3)    checkAchievement('fav_3');
  if (state.level >= 5)          checkAchievement('level_5');
  if (state.level >= 10)         checkAchievement('level_10');
}

/* ── THEME ───────────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeToggle');
const themeIcon = themeBtn.querySelector('.theme-icon');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeIcon.textContent = t === 'dark' ? '🌙' : '☀️';
}

themeBtn.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.theme);
  save();
  // achievements
  if (state.theme === 'light') checkAchievement('day_bird');
  else checkAchievement('night_owl');
});

/* ── FAVORITES ───────────────────────────────────────────────── */
function toggleFav(id, btnEl) {
  const idx = state.favs.indexOf(id);
  if (idx === -1) {
    state.favs.push(id);
    btnEl.classList.add('active');
    btnEl.textContent = '♥';
    toast(`❤️ Added ${GAMES[id]?.name} to favorites`);
    addXP(5, btnEl);
    checkAchievement('first_fav');
    checkAchievement('fav_3');
  } else {
    state.favs.splice(idx, 1);
    btnEl.classList.remove('active');
    btnEl.textContent = '♡';
    toast(`💔 Removed from favorites`);
  }
  save();
  renderFavs();
  renderProfile();
}

function renderFavs() {
  const section = document.getElementById('favSection');
  const row     = document.getElementById('favRow');
  document.getElementById('favCount').textContent = state.favs.length;
  if (state.favs.length === 0) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');
  row.innerHTML = '';
  state.favs.forEach(id => {
    const g = GAMES[id]; if (!g) return;
    const a = document.createElement('a');
    a.className = 'mini-card';
    a.href = g.href;
    a.innerHTML = `<span class="mc-icon">${g.icon}</span><span>${g.name}</span>`;
    row.appendChild(a);
  });
}

/* ── RECENTLY PLAYED ─────────────────────────────────────────── */
const RECENT_MAX = 6;

function trackPlay(id, anchor) {
  // remove if already in list then prepend
  state.recent = state.recent.filter(r => r.id !== id);
  state.recent.unshift({ id, ts: Date.now() });
  if (state.recent.length > RECENT_MAX) state.recent.pop();

  // track unique plays for achievements/XP
  if (!state.played.includes(id)) {
    state.played.push(id);
    addXP(10, anchor);
    // check dev lab achievement
    const devIds = ['bughunter','debugcode','commitpredictor','chaos','cosmic','destiny'];
    if (devIds.includes(id)) checkAchievement('explorer');
    checkAllAchievements();
  }

  save();
  renderRecent();
  renderProfile();
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

function renderRecent() {
  const section = document.getElementById('recentSection');
  const row     = document.getElementById('recentRow');
  if (state.recent.length === 0) { section.classList.add('hidden'); return; }
  section.classList.remove('hidden');
  row.innerHTML = '';
  state.recent.forEach(r => {
    const g = GAMES[r.id]; if (!g) return;
    const a = document.createElement('a');
    a.className = 'mini-card';
    a.href = g.href;
    a.innerHTML = `<span class="mc-icon">${g.icon}</span><span>${g.name}</span><span class="mc-time">${timeAgo(r.ts)}</span>`;
    row.appendChild(a);
  });
}

document.getElementById('clearRecent').addEventListener('click', () => {
  state.recent = [];
  save();
  renderRecent();
  toast('🗑️ History cleared');
});

/* ── PROFILE ─────────────────────────────────────────────────── */
function renderProfile() {
  document.getElementById('levelNum').textContent        = state.level;
  document.getElementById('xpVal').textContent           = `${state.xp} / ${xpForLevel(state.level)} XP`;
  document.getElementById('xpFill').style.width          = `${(state.xp / xpForLevel(state.level)) * 100}%`;
  document.getElementById('playerTitle').textContent     = titleFor(state.level);
  document.getElementById('achieveCount').textContent    = state.achieve.length;
  document.getElementById('gamesPlayedCount').textContent= state.played.length;
  document.getElementById('favCount').textContent        = state.favs.length;

  // avatar evolves with level
  const avatars = ['🎮','🕹️','⭐','🔥','🏆','🌟','💫','🚀','🌌','👑','🧙'];
  document.getElementById('avatar').textContent = avatars[Math.min(state.level - 1, avatars.length - 1)];
}

/* ── ACHIEVEMENTS RENDER ─────────────────────────────────────── */
function renderAchievements() {
  const container = document.getElementById('achievementContainer');
  container.innerHTML = '';
  ACHIEVEMENTS.forEach(a => {
    const unlocked = state.achieve.includes(a.id);
    const div = document.createElement('div');
    div.className = `achieve-chip ${unlocked ? 'unlocked' : 'locked'}`;
    div.innerHTML = `
      <span class="achieve-icon">${a.icon}</span>
      <div class="achieve-info">
        <span class="achieve-name">${a.name}</span>
        <span class="achieve-desc">${unlocked ? a.desc : '???'} ${unlocked ? `· +${a.xp} XP` : ''}</span>
      </div>`;
    container.appendChild(div);
  });
  document.getElementById('achieveCount').textContent = state.achieve.length;
}

/* ── FAV BUTTONS INIT ────────────────────────────────────────── */
function initFavButtons() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (state.favs.includes(id)) {
      btn.classList.add('active');
      btn.textContent = '♥';
    }
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      toggleFav(id, btn);
    });
  });
}

/* ── CARD CLICK → TRACK PLAY ─────────────────────────────────── */
function initCardClicks() {
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', e => {
      // don't block fav btn clicks (they stopPropagation already)
      const id = card.dataset.id;
      if (id) trackPlay(id, card);
    });
  });
}

/* ── SEARCH ──────────────────────────────────────────────────── */
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
let searchUsed = false;

function doSearch(q) {
  const query = q.trim().toLowerCase();
  searchClear.classList.toggle('hidden', query === '');

  if (!searchUsed && query.length > 0) {
    searchUsed = true;
    checkAchievement('searcher');
  }

  const cards = document.querySelectorAll('.game-card');
  let visible = 0;
  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const matches = query === '' || name.includes(query);
    card.classList.toggle('hidden-card', !matches);
    if (matches) visible++;
  });

  document.getElementById('noResults').classList.toggle('hidden', visible > 0 || query === '');

  // update section title visibility
  const gGrid = document.getElementById('gamesGrid');
  const dGrid = document.getElementById('devGrid');
  const gVisible = [...gGrid.querySelectorAll('.game-card')].some(c => !c.classList.contains('hidden-card'));
  const dVisible = [...dGrid.querySelectorAll('.game-card')].some(c => !c.classList.contains('hidden-card'));
  document.getElementById('gamesTitle').style.display = gVisible ? '' : 'none';
}

searchInput.addEventListener('input', e => doSearch(e.target.value));
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  doSearch('');
  searchInput.focus();
});

/* ── FILTER ──────────────────────────────────────────────────── */
let activeFilter = 'all';

function doFilter(filter) {
  activeFilter = filter;
  const cards = document.querySelectorAll('.game-card');
  cards.forEach(card => {
    const cats = (card.dataset.category || '').split(' ');
    const matches = filter === 'all' || cats.includes(filter);
    card.classList.toggle('hidden-card', !matches);
  });
  document.getElementById('noResults').classList.add('hidden');
  // reset search
  searchInput.value = '';
  searchClear.classList.add('hidden');
}

function updateFilterCounts() {
  const allCards = [...document.querySelectorAll('.game-card')];
  const counts = {
    all:       allCards.length,
    games:     allCards.filter(c => (c.dataset.category||'').includes('games')).length,
    developer: allCards.filter(c => (c.dataset.category||'').includes('developer')).length,
    logic:     allCards.filter(c => (c.dataset.category||'').includes('logic')).length,
    arcade:    allCards.filter(c => (c.dataset.category||'').includes('arcade')).length,
    memory:    allCards.filter(c => (c.dataset.category||'').includes('memory')).length,
  };
  Object.keys(counts).forEach(function(cat) {
    var el = document.getElementById('fc-' + cat);
    if (el) el.textContent = counts[cat];
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    doFilter(btn.dataset.filter);
  });
});

/* ── STATS BAR ───────────────────────────────────────────────── */
function renderStats() {
  const allCards = document.querySelectorAll('.game-card');
  const gameCards = document.querySelectorAll('#gamesGrid .game-card');
  const devCards  = document.querySelectorAll('#devGrid .game-card');
  document.getElementById('gamesCount').textContent = gameCards.length;
  document.getElementById('devCount').textContent   = devCards.length;
  document.getElementById('totalCount').textContent = allCards.length;
}

/* ── INIT ────────────────────────────────────────────────────── */
function init() {
  applyTheme(state.theme);
  renderProfile();
  renderStats();
  updateFilterCounts();
  renderRecent();
  renderFavs();
  renderAchievements();
  initFavButtons();
  initCardClicks();

  // first-ever visit XP
  if (state.played.length === 0 && state.xp === 0) {
    setTimeout(() => toast('👋 Welcome! Play games to earn XP and unlock achievements.'), 800);
  }
}

init();