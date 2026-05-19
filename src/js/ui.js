// ─────────────────────────────────────────
//  UI — Tema, filtros, búsqueda, banner
//  Depende de: storage.js, render.js
// ─────────────────────────────────────────

// ── TEMA ──
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('theme-toggle').textContent = dark ? '☀️' : '🌙';
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
  localStorage.setItem(LS_THEME, String(!isDark));
}

// ── FILTROS ──
function setFilter(filter) {
  saveFilter(filter);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}

// ── BÚSQUEDA ──
function handleSearch(value) {
  saveSearch(value);
  render();
}

// ── BANNER DE BIENVENIDA ──
function dismissWelcome() {
  sessionStorage.setItem(SS_BANNER, 'true');
  document.getElementById('welcome-banner').classList.add('hidden');
}
