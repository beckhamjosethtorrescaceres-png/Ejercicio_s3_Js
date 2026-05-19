// ─────────────────────────────────────────
//  MAIN — Arranque y event listeners
//  Depende de: storage.js, tasks.js, render.js, ui.js
//  Este archivo se carga de último.
// ─────────────────────────────────────────

function init() {
  // localStorage → tareas y tema
  loadTasks();
  const isDark = localStorage.getItem(LS_THEME) === 'true';
  if (isDark) applyTheme(true);

  // sessionStorage → filtro y búsqueda
  loadFilter();
  loadSearch();

  // Restaurar filtro activo en UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
  document.getElementById('search-input').value = searchText;

  // Banner de bienvenida
  if (sessionStorage.getItem(SS_BANNER)) {
    document.getElementById('welcome-banner').classList.add('hidden');
  }

  // Fecha actual
  document.getElementById('date-line').textContent =
    new Date().toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

  render();
}

// ─────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────
document.getElementById('add-btn')
  .addEventListener('click', addTask);

document.getElementById('task-input')
  .addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

document.getElementById('task-input')
  .addEventListener('input', e => updateCharCount(e.target.value));

document.querySelectorAll('.filter-btn')
  .forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

document.getElementById('search-input')
  .addEventListener('input', e => handleSearch(e.target.value));

document.getElementById('theme-toggle')
  .addEventListener('click', toggleTheme);

// ─────────────────────────────────────────
//  ARRANQUE
// ─────────────────────────────────────────
init();
