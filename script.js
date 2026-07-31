/* ================================================================
   CODEQUEST ARENA — script.js  (fully synced with new index.html)
   ✅ Sidebar nav scroll + active highlight
   ✅ Mobile hamburger open/close + overlay
   ✅ Dark/light theme — both sidebar btn + top header btn
   ✅ Player name editor (modal + localStorage)
   ✅ Avatar picker (modal, level-gated, localStorage)
   ✅ XP + Level + Titles (12 tiers)
   ✅ All dashboard IDs: pdName, pdLevel, pdXpFill, pdXpNums,
       pdAchieve, pdPlayed, pdFavs, pdStreak,
       sidebarName, sidebarTitle, sidebarLevel, sidebarXpNums,
       sidebarXpFill, sidebarAvatar
   ✅ 14 Achievements with popup
   ✅ Daily challenge panel with countdown
   ✅ Bottom panels: recently played, achievements, daily
   ✅ Favorites + recently played mini-cards
   ✅ Played badges + best scores on cards
   ✅ Search (live) + filter (with counts)
   ✅ latestPlayed stat
   ✅ Toast + floating XP labels
   ✅ Confetti on achievement unlock
   ✅ All data localStorage
   ================================================================ */

'use strict';

/* ── STORAGE KEYS ──────────────────────────────────────────── */
const K = {
  theme:  'cqa_theme',
  favs:   'cqa_favs',
  recent: 'cqa_recent',
  xp:     'cqa_xp',
  level:  'cqa_level',
  played: 'cqa_played',
  achieve:'cqa_achievements',
  name:   'cqa_name',
  avatar: 'cqa_avatar',
  scores: 'cqa_scores',
  daily:  'cqa_daily',
};
const ls    = k    => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const lsSet = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const $     = id   => document.getElementById(id);

/* ── GAME REGISTRY ─────────────────────────────────────────── */
const GAMES = {
  numguess:       { name:'Number Guessing',     icon:'🎯', href:'Number-Guessing-Game/',                          cat:'games'    },
  rps:            { name:'Rock Paper Scissors', icon:'✂️', href:'Rock-Paper-Scissors/',                           cat:'games'    },
  snake:          { name:'Snake Game',          icon:'🐍', href:'Snake-Game/',                                    cat:'games'    },
  memory:         { name:'Memory Card',         icon:'🧠', href:'Memory-Card-Game/',                              cat:'games'    },
  simon:          { name:'Simon Says',          icon:'🎵', href:'Simon-Says-Game/',                               cat:'games'    },
  whack:          { name:'Whack-A-Mole',        icon:'⚡', href:'Whack-A-Mole/',                                 cat:'games'    },
  '2048':         { name:'2048 Game',           icon:'🎮', href:'2048-Game/',                                    cat:'games'    },
  bughunter:      { name:'Bug Hunter',          icon:'🐞', href:'Developer-Lab/Bug-Hunter/index.html',           cat:'developer'},
  debugcode:      { name:'Debug The Code',      icon:'🐛', href:'Developer-Lab/Debug-The-Code/index.html',      cat:'developer'},
  commitpredictor:{ name:'Commit Predictor',    icon:'🔮', href:'Developer-Lab/Commit-Predictor/index.html',    cat:'developer'},
  chaos:          { name:'Chaos Button',        icon:'☄️', href:'Developer-Lab/Chaos-Button/index.html',        cat:'developer'},
  cosmic:         { name:'Cosmic Coder',        icon:'🌌', href:'Developer-Lab/Cosmic-Coder-Generator/index.html', cat:'developer'},
  destiny:        { name:'Developer Destiny',   icon:'🔥', href:'Developer-Lab/Developer-Destiny/index.html',   cat:'developer'},
};
const GAME_IDS   = Object.keys(GAMES);
const GAMES_IDS  = GAME_IDS.filter(id => GAMES[id].cat === 'games');
const DEV_IDS    = GAME_IDS.filter(id => GAMES[id].cat === 'developer');

/* ── TITLES & XP ───────────────────────────────────────────── */
const TITLES = ['Newcomer','Rookie','Explorer','Tinkerer','Coder','Builder',
  'Challenger','Strategist','Champion','Wizard','Game Master','Legend'];
const AVATARS = [
  {e:'🎮',lvl:1},{e:'🕹️',lvl:1},{e:'⭐',lvl:2},{e:'🔥',lvl:3},
  {e:'💜',lvl:4},{e:'🧪',lvl:5},{e:'🏆',lvl:6},{e:'🌟',lvl:7},
  {e:'💫',lvl:8},{e:'🚀',lvl:9},{e:'🌌',lvl:10},{e:'👑',lvl:11},
  {e:'🧙',lvl:12},{e:'🦄',lvl:15},{e:'🐉',lvl:20},
];
const xpForLevel = lvl => lvl * 100;
const titleFor   = lvl => TITLES[Math.min(lvl-1, TITLES.length-1)];

/* ── ACHIEVEMENTS ──────────────────────────────────────────── */
const ACHIEVEMENTS = [
  {id:'first_play',   icon:'🎮', name:'First Launch',   desc:'Played your first game',           xp:20},
  {id:'play_3',       icon:'🔥', name:'On a Roll',       desc:'Played 3 different games',         xp:30},
  {id:'play_5',       icon:'⭐', name:'Game Hopper',     desc:'Played 5 different games',         xp:50},
  {id:'play_all',     icon:'🏅', name:'Completionist',   desc:'Visited all 13 games',             xp:150},
  {id:'first_fav',    icon:'❤️', name:'Bookmarked',      desc:'Favorited your first game',        xp:15},
  {id:'fav_5',        icon:'💜', name:'Collector',       desc:'Favorited 5 games',                xp:40},
  {id:'explorer',     icon:'🧪', name:'Lab Explorer',    desc:'Visited a Developer Lab game',     xp:25},
  {id:'daily_done',   icon:'🗓️', name:'Daily Grinder',   desc:'Completed a daily challenge',      xp:0 },
  {id:'searcher',     icon:'🔍', name:'The Searcher',    desc:'Used the search bar',              xp:10},
  {id:'night_owl',    icon:'🌙', name:'Night Owl',       desc:'Switched to dark mode',            xp:10},
  {id:'day_bird',     icon:'☀️', name:'Early Bird',      desc:'Switched to light mode',           xp:10},
  {id:'level_5',      icon:'🚀', name:'Rising Star',     desc:'Reached Level 5',                  xp:75},
  {id:'level_10',     icon:'🌟', name:'Game Master',     desc:'Reached Level 10',                 xp:150},
  {id:'score_setter', icon:'📈', name:'Score Setter',    desc:'Set a best score on any game',     xp:25},
];

/* ── DAILY CHALLENGES ──────────────────────────────────────── */
const DAILY_POOL = [
  {game:'numguess',       title:'Guess in 3!',        desc:'Solve Number Guessing on Hard in ≤3 tries.',          xp:50},
  {game:'rps',            title:'Win a Bo7',           desc:'Beat the CPU in a Best-of-7 match.',                  xp:40},
  {game:'snake',          title:'Snake Sprint',        desc:'Score 100+ points without dying.',                    xp:45},
  {game:'memory',         title:'Perfect Memory',      desc:'Complete Memory Card with 0 mismatches.',             xp:55},
  {game:'simon',          title:'Simon Streak',        desc:'Reach round 10 in Simon Says.',                       xp:60},
  {game:'whack',          title:'Mole Menace',         desc:'Whack 30 moles in 30 seconds.',                       xp:45},
  {game:'2048',           title:'2048 Rush',           desc:'Reach the 512 tile in one game.',                     xp:50},
  {game:'bughunter',      title:'Zero Bugs',           desc:'Clear all bugs in Bug Hunter without missing.',       xp:40},
  {game:'debugcode',      title:'Code Doctor',         desc:'Debug 5 snippets in a row.',                          xp:45},
  {game:'commitpredictor',title:'Git Guru',            desc:'Score 100% in Commit Predictor.',                     xp:55},
  {game:'chaos',          title:'Chaos Survivor',      desc:'Complete a Hard chaos challenge.',                    xp:50},
  {game:'cosmic',         title:'Cosmic Composer',     desc:'Generate 5 cosmic coder names.',                      xp:35},
  {game:'destiny',        title:'Destiny Seeker',      desc:'Reveal your developer destiny 3 times.',              xp:35},
];

/* ── STATE ─────────────────────────────────────────────────── */
let S = {
  theme:  ls(K.theme)  || 'dark',
  favs:   ls(K.favs)   || [],
  recent: ls(K.recent) || [],
  xp:     ls(K.xp)     || 0,
  level:  ls(K.level)  || 1,
  played: ls(K.played) || [],
  achieve:ls(K.achieve)|| [],
  name:   ls(K.name)   || 'Guest Player',
  avatar: ls(K.avatar) || '🎮',
  scores: ls(K.scores) || {},
  daily:  ls(K.daily)  || {date:'', done:false},
};

const save = () => {
  lsSet(K.theme,  S.theme);  lsSet(K.favs,   S.favs);
  lsSet(K.recent, S.recent); lsSet(K.xp,     S.xp);
  lsSet(K.level,  S.level);  lsSet(K.played, S.played);
  lsSet(K.achieve,S.achieve);lsSet(K.name,   S.name);
  lsSet(K.avatar, S.avatar); lsSet(K.scores, S.scores);
  lsSet(K.daily,  S.daily);
};

/* ── TOAST ─────────────────────────────────────────────────── */
let tTimer;
function toast(msg) {
  const el = $('toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(tTimer); tTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ── XP FLOAT ──────────────────────────────────────────────── */
function floatXP(amount, anchor) {
  const el = document.createElement('div');
  el.className = 'xp-pop'; el.textContent = `+${amount} XP`;
  const r = anchor ? anchor.getBoundingClientRect() : {left:innerWidth/2,top:innerHeight/2,width:0};
  el.style.cssText = `left:${r.left+r.width/2}px;top:${r.top+scrollY-10}px`;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/* ── ACHIEVEMENT POPUP ─────────────────────────────────────── */
let popTimer;
function showAchievePopup(def) {
  const p = $('achievePopup');
  $('apIcon').textContent = def.icon;
  $('apName').textContent = def.name;
  $('apXp').textContent   = def.xp > 0 ? `+${def.xp} XP` : '';
  p.classList.remove('hidden');
  clearTimeout(popTimer);
  popTimer = setTimeout(() => p.classList.add('hidden'), 3500);
}

/* ── XP + LEVEL ────────────────────────────────────────────── */
function addXP(amount, anchor) {
  S.xp += amount;
  let leveled = false;
  while (S.xp >= xpForLevel(S.level)) { S.xp -= xpForLevel(S.level); S.level++; leveled = true; }
  save(); if (amount > 0) floatXP(amount, anchor);
  if (leveled) { toast(`🎉 Level Up! Level ${S.level} — ${titleFor(S.level)}`); renderAvatarGrid(); }
  renderAllProfile();
}

/* ── ACHIEVEMENTS ──────────────────────────────────────────── */
function checkAchievement(id) {
  if (S.achieve.includes(id)) return;
  const def = ACHIEVEMENTS.find(a => a.id === id); if (!def) return;
  const gates = {
    play_3:  () => S.played.length >= 3,
    play_5:  () => S.played.length >= 5,
    play_all:() => S.played.length >= GAME_IDS.length,
    fav_5:   () => S.favs.length >= 5,
    level_5: () => S.level >= 5,
    level_10:() => S.level >= 10,
  };
  if (gates[id] && !gates[id]()) return;
  S.achieve.push(id); save();
  showAchievePopup(def);
  if (def.xp > 0) addXP(def.xp);
  renderAchievements(); renderBottomPanels();
}

function checkAll() {
  if (S.played.length >= 1)            checkAchievement('first_play');
  if (S.played.length >= 3)            checkAchievement('play_3');
  if (S.played.length >= 5)            checkAchievement('play_5');
  checkAchievement('play_all');
  if (S.favs.length >= 1)              checkAchievement('first_fav');
  if (S.favs.length >= 5)              checkAchievement('fav_5');
  if (S.level >= 5)                    checkAchievement('level_5');
  if (S.level >= 10)                   checkAchievement('level_10');
}

/* ── THEME ─────────────────────────────────────────────────── */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const icon = t === 'dark' ? '🌙' : '☀️';
  const label = t === 'dark' ? 'Dark' : 'Light';
  // sidebar button
  const sb = $('themeToggle');
  if (sb) { sb.querySelector('.theme-icon').textContent = icon; sb.childNodes[sb.childNodes.length-1].textContent = ' '+label; }
  // top header button
  const tb = $('themeToggleTop');
  if (tb) { tb.querySelector('.theme-icon').textContent = icon; tb.childNodes[tb.childNodes.length-1].textContent = ' '+label+' Mode'; }
}

function handleThemeToggle() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  applyTheme(S.theme); save();
  checkAchievement(S.theme === 'light' ? 'day_bird' : 'night_owl');
}

const themeToggle    = $('themeToggle');
const themeToggleTop = $('themeToggleTop');
if (themeToggle)    themeToggle.addEventListener('click', handleThemeToggle);
if (themeToggleTop) themeToggleTop.addEventListener('click', handleThemeToggle);

/* ── SIDEBAR NAV ───────────────────────────────────────────── */
// Mobile hamburger
const menuToggle     = $('menuToggle');
const sidebar        = $('sidebar');
const sidebarOverlay = $('sidebarOverlay');

function openSidebar()  { sidebar.classList.add('open'); sidebarOverlay.classList.remove('hidden'); document.body.style.overflow='hidden'; }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.add('hidden'); document.body.style.overflow=''; }

if (menuToggle)     menuToggle.addEventListener('click', openSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// Sidebar CTA — scroll to games grid
const sidebarCta = $('sidebarCta');
if (sidebarCta) sidebarCta.addEventListener('click', () => {
  scrollToSection('gamesGrid'); closeSidebar();
});

// Nav links with data-scroll
document.querySelectorAll('.nav-link[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.scroll;
    // Update active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    scrollSpyPaused = true;
    scrollToSection(target);
    closeSidebar();
    setTimeout(() => { scrollSpyPaused = false; }, 900);
  });
});

// Profile nav → open name modal
const navProfile = $('navProfile');
if (navProfile) navProfile.addEventListener('click', e => {
  e.preventDefault();
  $('nameInput').value = S.name;
  $('nameModal').classList.remove('hidden');
  closeSidebar();
});

// Settings → theme toggle
const navSettings = $('navSettings');
if (navSettings) navSettings.addEventListener('click', e => {
  e.preventDefault(); handleThemeToggle(); closeSidebar();
});

function scrollToSection(id) {
  const el = $(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 20;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

// Highlight nav link on scroll
const NAV_TARGETS = ['gamesGrid','devGrid','achievementContainer','favSection','recentSection','dailyPanel','lbSection'];
let scrollTicking = false;
let scrollSpyPaused = false;
window.addEventListener('scroll', () => {
  if (scrollTicking || scrollSpyPaused) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    let active = null;
    NAV_TARGETS.forEach(id => {
      const el = $(id); if (!el) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.6) active = id;
    });
    if (active) {
      document.querySelectorAll('.nav-link[data-scroll]').forEach(l => {
        l.classList.toggle('active', l.dataset.scroll === active);
      });
    }
    scrollTicking = false;
  });
}, {passive:true});

/* ── RENDER PROFILE (ALL ELEMENTS) ────────────────────────── */
function renderAllProfile() {
  const pct = Math.round(S.xp / xpForLevel(S.level) * 100);
  const xpStr = `${S.xp} / ${xpForLevel(S.level)} XP`;

  // Top player dashboard
  if ($('pdName'))    $('pdName').textContent    = S.name;
  if ($('pdLevel'))   $('pdLevel').textContent   = S.level;
  if ($('pdXpFill'))  $('pdXpFill').style.width  = pct + '%';
  if ($('pdXpNums'))  $('pdXpNums').textContent  = xpStr;
  if ($('pdTitle'))   $('pdTitle').textContent   = titleFor(S.level).toUpperCase();
  if ($('pdAvatar'))  $('pdAvatar').textContent  = S.avatar;
  if ($('pdAchieve')) $('pdAchieve').textContent = S.achieve.length;
  if ($('pdPlayed'))  $('pdPlayed').textContent  = S.played.length;
  if ($('pdFavs'))    $('pdFavs').textContent    = S.favs.length;
  if ($('pdStreak'))  $('pdStreak').textContent  = calcStreak();

  // Sidebar bottom profile
  if ($('sidebarName'))    $('sidebarName').textContent    = S.name;
  if ($('sidebarTitle'))   $('sidebarTitle').textContent   = titleFor(S.level);
  if ($('sidebarAvatar'))  $('sidebarAvatar').textContent  = S.avatar;
  if ($('sidebarLevel'))   $('sidebarLevel').textContent   = S.level;
  if ($('sidebarXpNums'))  $('sidebarXpNums').textContent  = xpStr;
  if ($('sidebarXpFill'))  $('sidebarXpFill').style.width  = pct + '%';

  // Stat chips in achievement section
  if ($('achieveCount'))     $('achieveCount').textContent     = S.achieve.length;
  if ($('gamesPlayedCount')) $('gamesPlayedCount').textContent = S.played.length;
  if ($('favCount'))         $('favCount').textContent         = S.favs.length;
  if ($('completionPct'))    $('completionPct').textContent    = Math.round(S.played.length/GAME_IDS.length*100)+'%';
  if ($('achieveProgress'))  $('achieveProgress').textContent  = `${S.achieve.length}/${ACHIEVEMENTS.length}`;

  // Latest played stat
  if ($('latestPlayed')) {
    const last = S.recent[0];
    $('latestPlayed').textContent = last ? (GAMES[last.id]?.name || '—') : '—';
  }
}

function calcStreak() {
  // simple: number of days in a row with at least 1 play (approximation via recent)
  const days = new Set(S.recent.map(r => new Date(r.ts).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate()-1); }
  return streak;
}

/* ── COMPLETION BARS ───────────────────────────────────────── */
function renderCompletionBars() {
  const gPlayed = S.played.filter(id => GAMES[id]?.cat === 'games').length;
  const dPlayed = S.played.filter(id => GAMES[id]?.cat === 'developer').length;
  if ($('gamesFill')) $('gamesFill').style.width = (gPlayed / GAMES_IDS.length * 100) + '%';
  if ($('devFill'))   $('devFill').style.width   = (dPlayed / DEV_IDS.length   * 100) + '%';
  if ($('gamesPct'))  $('gamesPct').textContent  = `${gPlayed}/${GAMES_IDS.length}`;
  if ($('devPct'))    $('devPct').textContent    = `${dPlayed}/${DEV_IDS.length}`;
}

/* ── RECENTLY PLAYED ───────────────────────────────────────── */
const RECENT_MAX = 6;
function timeAgo(ts) {
  const d=Date.now()-ts, m=Math.floor(d/60000);
  if(m<1)return'just now'; if(m<60)return`${m}m ago`;
  const h=Math.floor(m/60); if(h<24)return`${h}h ago`;
  return`${Math.floor(h/24)}d ago`;
}

function trackPlay(id, anchor) {
  S.recent = [{id, ts:Date.now()}, ...S.recent.filter(r=>r.id!==id)].slice(0, RECENT_MAX);
  if (!S.played.includes(id)) {
    S.played.push(id);
    addXP(10, anchor);
    if (GAMES[id]?.cat === 'developer') checkAchievement('explorer');
    checkAll();
  }
  save(); renderRecent(); renderCompletionBars(); renderAllProfile();
  updatePlayedBadges();
}

function renderRecent() {
  // mini card row (top of page)
  const sec = $('recentSection'), row = $('recentRow');
  if (sec && row) {
    if (!S.recent.length) { sec.classList.add('hidden'); }
    else {
      sec.classList.remove('hidden');
      row.innerHTML = S.recent.map(r => {
        const g = GAMES[r.id]; if (!g) return '';
        return `<a class="mini-card" href="${g.href}"><span class="mc-icon">${g.icon}</span><span>${g.name}</span><span class="mc-time">${timeAgo(r.ts)}</span></a>`;
      }).join('');
    }
  }
}

// clear button (top row)
const clrRecent = $('clearRecent');
if (clrRecent) clrRecent.addEventListener('click', () => {
  S.recent=[]; save(); renderRecent(); renderAllProfile(); renderBottomPanels();
  toast('🗑️ History cleared');
});
// clear button (bottom panel)
const clrRecent2 = $('clearRecent2');
if (clrRecent2) clrRecent2.addEventListener('click', () => {
  S.recent=[]; save(); renderRecent(); renderAllProfile(); renderBottomPanels();
  toast('🗑️ History cleared');
});

/* ── FAVORITES ─────────────────────────────────────────────── */
function toggleFav(id, btn) {
  const i = S.favs.indexOf(id);
  if (i === -1) {
    S.favs.push(id);
    btn.classList.add('active'); btn.textContent = '♥';
    toast(`❤️ Added ${GAMES[id]?.name} to favorites`);
    addXP(5, btn); checkAchievement('first_fav'); checkAchievement('fav_5');
  } else {
    S.favs.splice(i,1); btn.classList.remove('active'); btn.textContent = '♡';
    toast('💔 Removed from favorites');
  }
  save(); renderFavs(); renderAllProfile();
}

function renderFavs() {
  const sec = $('favSection'), row = $('favRow');
  if (!sec || !row) return;
  if ($('favCount')) $('favCount').textContent = S.favs.length;
  if (!S.favs.length) { sec.classList.add('hidden'); return; }
  sec.classList.remove('hidden');
  row.innerHTML = S.favs.map(id => {
    const g = GAMES[id]; if (!g) return '';
    return `<a class="mini-card" href="${g.href}"><span class="mc-icon">${g.icon}</span><span>${g.name}</span></a>`;
  }).join('');
}

/* ── ACHIEVEMENTS RENDER ───────────────────────────────────── */
function renderAchievements() {
  const c = $('achievementContainer'); if (!c) return;
  c.innerHTML = ACHIEVEMENTS.map(a => {
    const u = S.achieve.includes(a.id);
    return `<div class="achieve-chip ${u?'unlocked':'locked'}">
      <span class="achieve-icon">${a.icon}</span>
      <div class="achieve-info">
        <span class="achieve-name">${a.name}</span>
        <span class="achieve-desc">${u?a.desc+(a.xp?` · +${a.xp} XP`:''):'???'}</span>
      </div></div>`;
  }).join('');
}

/* ── BOTTOM 3 PANELS ───────────────────────────────────────── */
function renderBottomPanels() {
  // Recently Played panel
  const rpl = $('recentPanelList');
  if (rpl) {
    if (!S.recent.length) {
      rpl.innerHTML = '<p class="panel-empty">Play games to see history!</p>';
    } else {
      rpl.innerHTML = S.recent.slice(0,4).map(r => {
        const g = GAMES[r.id]; if (!g) return '';
        return `<div class="recent-item"><span class="ri-icon">${g.icon}</span><span class="ri-name">${g.name}</span><span class="ri-time">${timeAgo(r.ts)}</span></div>`;
      }).join('');
    }
  }

  // Achievements panel
  const apl = $('achievePanelList');
  if (apl) {
    const unlocked = ACHIEVEMENTS.filter(a => S.achieve.includes(a.id));
    const locked   = ACHIEVEMENTS.filter(a => !S.achieve.includes(a.id));
    if (!unlocked.length) {
      apl.innerHTML = '<p class="panel-empty">Unlock achievements to see them here!</p>';
    } else {
      const show = [...unlocked.slice(0,2), ...locked.slice(0,2)];
      apl.innerHTML = show.map(a => {
        const u = S.achieve.includes(a.id);
        return `<div class="achieve-panel-item">
          <span class="api-icon">${a.icon}</span>
          <div class="api-info"><div class="api-name">${a.name}</div><div class="api-desc">${u?a.desc:'???'}</div></div>
          ${u ? '' : '<span class="api-lock">🔒</span>'}
        </div>`;
      }).join('');
    }
  }
}

/* ── DAILY CHALLENGE ───────────────────────────────────────── */
function todayKey() {
  const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function getDailyChallenge() {
  const d = new Date();
  const idx = (d.getFullYear()*1000 + d.getMonth()*31 + d.getDate()) % DAILY_POOL.length;
  return DAILY_POOL[idx];
}
function renderDailyPanel() {
  const content = $('dailyChallengeContent'); if (!content) return;
  const ch = getDailyChallenge();
  const g  = GAMES[ch.game];
  const today = todayKey();
  const done  = S.daily.date === today && S.daily.done;

  content.innerHTML = `
    <div class="daily-item">
      <span class="di-icon">${g?.icon || '🎮'}</span>
      <div class="di-info">
        <div class="di-title">${ch.title}</div>
        <div class="di-desc">${ch.desc}</div>
      </div>
      <span class="di-xp">${done ? '✅ Done' : '+'+ch.xp+' XP'}</span>
    </div>
    <a href="${g?.href||'#'}" class="play-btn" style="display:block;text-align:center;margin-top:10px;padding:9px;border-radius:8px;background:linear-gradient(135deg,var(--purple),var(--purple-dark));color:#fff;font-weight:700;font-size:.82rem;${done?'opacity:.5;pointer-events:none;':''}"
      ${done?'':'onclick="markDailyDone()"'}>${done ? '✅ Completed!' : '▶ Play Now'}</a>`;
}

window.markDailyDone = function() {
  const today = todayKey();
  if (S.daily.date === today && S.daily.done) return;
  const ch = getDailyChallenge();
  S.daily = {date:today, done:true}; save();
  addXP(ch.xp); checkAchievement('daily_done');
  renderDailyPanel(); toast(`🗓️ Daily challenge complete! +${ch.xp} XP`);
};

function updateDailyTimer() {
  const el = $('dailyTimer'); if (!el) return;
  const now = new Date(), midnight = new Date(now); midnight.setHours(24,0,0,0);
  const diff = midnight - now;
  const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
  el.textContent = `Resets in ${h}h ${m}m ${s}s`;
}
setInterval(updateDailyTimer, 1000);

/* ── AVATAR PICKER ─────────────────────────────────────────── */
function renderAvatarGrid() {
  const grid = $('avatarGrid'); if (!grid) return;
  grid.innerHTML = AVATARS.map(a => {
    const locked = S.level < a.lvl, active = S.avatar === a.e;
    return `<button class="avatar-opt${active?' active':''}${locked?' locked':''}"
      data-emoji="${a.e}" ${locked?'disabled':''} title="${locked?'Unlocks at Level '+a.lvl:'Select'}">
      ${a.e}</button>`;
  }).join('');
  grid.querySelectorAll('.avatar-opt:not(.locked)').forEach(btn => {
    btn.addEventListener('click', () => {
      S.avatar = btn.dataset.emoji; save();
      renderAllProfile(); renderAvatarGrid();
      toast('🎨 Avatar updated!');
    });
  });
}

const pdAvatar = $('pdAvatar');
if (pdAvatar) pdAvatar.addEventListener('click', () => { renderAvatarGrid(); $('avatarModal').classList.remove('hidden'); });
const avatarModalClose = $('avatarModalClose');
if (avatarModalClose) avatarModalClose.addEventListener('click', () => $('avatarModal').classList.add('hidden'));
const avatarModal = $('avatarModal');
if (avatarModal) avatarModal.addEventListener('click', e => { if(e.target===avatarModal) avatarModal.classList.add('hidden'); });

/* ── NAME EDITOR ───────────────────────────────────────────── */
const editNameBtn = $('editNameBtn');
if (editNameBtn) editNameBtn.addEventListener('click', () => { $('nameInput').value=S.name; $('nameModal').classList.remove('hidden'); $('nameInput').focus(); });
const nameModalClose = $('nameModalClose');
if (nameModalClose) nameModalClose.addEventListener('click', () => $('nameModal').classList.add('hidden'));
const nameModal = $('nameModal');
if (nameModal) nameModal.addEventListener('click', e => { if(e.target===nameModal) nameModal.classList.add('hidden'); });
const nameSave = $('nameSave');
if (nameSave) nameSave.addEventListener('click', () => {
  const v = $('nameInput').value.trim(); if(!v) return;
  S.name=v; save(); renderAllProfile(); $('nameModal').classList.add('hidden'); toast(`👤 Name set to "${v}"!`);
});
const nameInput = $('nameInput');
if (nameInput) nameInput.addEventListener('keydown', e => { if(e.key==='Enter') nameSave.click(); });

/* ── PLAYED BADGES ─────────────────────────────────────────── */
function updatePlayedBadges() {
  document.querySelectorAll('.played-badge').forEach(b => {
    b.classList.toggle('hidden', !S.played.includes(b.dataset.id));
  });
}

/* ── BEST SCORES ON CARDS ──────────────────────────────────── */
function renderAllBestScores() {
  GAME_IDS.forEach(id => {
    const el = $(`best-${id}`); if (!el) return;
    el.textContent = S.scores[id] ? `Best: ${S.scores[id].score.toLocaleString()}` : '';
  });
}
// Expose globally for game pages to call: window.CQA.setScore('snake', 420)
window.CQA = {
  setScore(gameId, score) {
    if (!S.scores[gameId] || score > S.scores[gameId].score) {
      S.scores[gameId] = {score, date: new Date().toLocaleDateString()};
      save(); checkAchievement('score_setter'); renderAllBestScores();
      toast(`🏆 New best in ${GAMES[gameId]?.name || gameId}!`);
    }
  },
  trackPlay
};

/* ── CARD INTERACTIONS ─────────────────────────────────────── */
function initCards() {
  // Fav buttons (both .fav-btn and .card-fav-btn)
  document.querySelectorAll('.fav-btn, .card-fav-btn').forEach(btn => {
    const id = btn.dataset.id; if (!id) return;
    if (S.favs.includes(id)) { btn.classList.add('active'); btn.textContent = '♥'; }
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleFav(id, btn); });
  });

  // Card clicks → navigate + track
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', e => {
      // Don't navigate if fav button was clicked (it stops propagation)
      const id = card.dataset.id; if (!id) return;
      trackPlay(id, card);
    });
  });
}

/* ── SEARCH ────────────────────────────────────────────────── */
let searchUsed = false;
const searchInput = $('searchInput');
const searchClear = $('searchClear');

if (searchInput) searchInput.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  if (searchClear) searchClear.classList.toggle('hidden', !q);
  if (!searchUsed && q) { searchUsed = true; checkAchievement('searcher'); }
  let visible = 0;
  document.querySelectorAll('.game-card').forEach(c => {
    const match = !q || (c.dataset.name||'').toLowerCase().includes(q);
    c.classList.toggle('hidden-card', !match);
    if (match) visible++;
  });
  const noRes = $('noResults');
  if (noRes) noRes.classList.toggle('hidden', visible > 0 || !q);
  const gt = $('gamesTitle');
  if (gt && $('gamesGrid')) gt.style.display = [...$('gamesGrid').querySelectorAll('.game-card')].some(c=>!c.classList.contains('hidden-card')) ? '' : 'none';
});

if (searchClear) searchClear.addEventListener('click', () => {
  if (searchInput) { searchInput.value=''; searchInput.dispatchEvent(new Event('input')); searchInput.focus(); }
});

/* ── FILTER ────────────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.classList.add('hidden');
    document.querySelectorAll('.game-card').forEach(c => {
      c.classList.toggle('hidden-card', f !== 'all' && !(c.dataset.category||'').includes(f));
    });
    const noRes = $('noResults'); if (noRes) noRes.classList.add('hidden');
  });
});

function updateFilterCounts() {
  const all = [...document.querySelectorAll('.game-card')];
  [['all','all'],['games','games'],['developer','developer'],['logic','logic'],['arcade','arcade'],['memory','memory']]
    .forEach(([k,v]) => {
      const el = $('fc-'+k); if (!el) return;
      el.textContent = v==='all' ? all.length : all.filter(c=>(c.dataset.category||'').includes(v)).length;
    });
}

/* ── STATS ─────────────────────────────────────────────────── */
function renderStats() {
  const g = document.querySelectorAll('#gamesGrid .game-card');
  const d = document.querySelectorAll('#devGrid .game-card');
  const a = document.querySelectorAll('.game-card');
  if ($('gamesCount')) $('gamesCount').textContent = g.length;
  if ($('devCount'))   $('devCount').textContent   = d.length;
  if ($('totalCount')) $('totalCount').textContent = a.length;
}

/* ── INIT ──────────────────────────────────────────────────── */
function init() {
  applyTheme(S.theme);
  renderAllProfile();
  renderStats();
  updateFilterCounts();
  renderRecent();
  renderFavs();
  renderAchievements();
  renderBottomPanels();
  renderDailyPanel();
  renderAllBestScores();
  updatePlayedBadges();
  renderAvatarGrid();
  initCards();
  updateDailyTimer();

  if (!S.played.length && !S.achieve.length) {
    setTimeout(() => toast('👾 Welcome to CodeQuest Arena! Play games to earn XP.'), 1200);
  }
}

init();