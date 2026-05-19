
// ─────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────
let tasks = [];
let currentFilter = 'all';
let searchText = '';

// ─────────────────────────────────────────
//  STORAGE KEYS
// ─────────────────────────────────────────
const LS_TASKS  = 'ws_tasks';
const LS_THEME  = 'ws_dark_mode';
const SS_FILTER = 'ws_filter';
const SS_SEARCH = 'ws_search';
const SS_BANNER = 'ws_banner_dismissed';

// ─────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────
function init() {
  // localStorage → tareas y tema
  tasks = JSON.parse(localStorage.getItem(LS_TASKS) || '[]');
  const isDark = localStorage.getItem(LS_THEME) === 'true';
  if (isDark) applyTheme(true);

  // sessionStorage → filtro y búsqueda
  currentFilter = sessionStorage.getItem(SS_FILTER) || 'all';
  searchText    = sessionStorage.getItem(SS_SEARCH) || '';

  // Restaurar filtro activo en UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
  document.getElementById('search-input').value = searchText;

  // Banner de bienvenida (sessionStorage)
  if (sessionStorage.getItem(SS_BANNER)) {
    document.getElementById('welcome-banner').classList.add('hidden');
  }

  // Fecha
  document.getElementById('date-line').textContent =
    new Date().toLocaleDateString('es-ES', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  render();
}

// ─────────────────────────────────────────
//  PERSIST
// ─────────────────────────────────────────
function saveTasks() {
  localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
}

// ─────────────────────────────────────────
//  ADD TASK
// ─────────────────────────────────────────
function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) { input.focus(); return; }

  const task = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  saveTasks();
  input.value = '';
  updateCharCount('');
  render();
}

// ─────────────────────────────────────────
//  TOGGLE COMPLETE
// ─────────────────────────────────────────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

// ─────────────────────────────────────────
//  DELETE TASK
// ─────────────────────────────────────────
function deleteTask(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) {
    el.classList.add('removing');
    el.addEventListener('animationend', () => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }, { once: true });
  }
}

// ─────────────────────────────────────────
//  EDIT TASK
// ─────────────────────────────────────────
function startEdit(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  const task = tasks.find(t => t.id === id);
  if (!el || !task) return;

  const textEl = el.querySelector('.task-text');
  const actionsEl = el.querySelector('.task-actions');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = task.text;
  input.maxLength = 120;

  textEl.replaceWith(input);
  input.focus();
  input.select();

  // Replace edit button with save
  const editBtn = el.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.textContent = '💾';
    editBtn.title = 'Guardar';
    editBtn.classList.add('save');
    editBtn.onclick = () => saveEdit(id, input);
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveEdit(id, input);
    if (e.key === 'Escape') render();
  });
}

function saveEdit(id, input) {
  const text = input.value.trim();
  if (!text) return;
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.text = text;
    saveTasks();
    render();
  }
}

// ─────────────────────────────────────────
//  FILTER (sessionStorage)
// ─────────────────────────────────────────
function setFilter(filter) {
  currentFilter = filter;
  sessionStorage.setItem(SS_FILTER, filter);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}

// ─────────────────────────────────────────
//  SEARCH (sessionStorage)
// ─────────────────────────────────────────
function handleSearch(value) {
  searchText = value;
  sessionStorage.setItem(SS_SEARCH, value);
  render();
}

// ─────────────────────────────────────────
//  WELCOME BANNER (sessionStorage)
// ─────────────────────────────────────────
function dismissWelcome() {
  sessionStorage.setItem(SS_BANNER, 'true');
  document.getElementById('welcome-banner').classList.add('hidden');
}

// ─────────────────────────────────────────
//  THEME (localStorage)
// ─────────────────────────────────────────
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('theme-toggle').textContent = dark ? '☀️' : '🌙';
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(!isDark);
  localStorage.setItem(LS_THEME, String(!isDark));
}

// ─────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────
function render() {
  // Filter & search
  let visible = tasks.filter(t => {
    const matchFilter =
      currentFilter === 'all' ||
      (currentFilter === 'pending'   && !t.completed) ||
      (currentFilter === 'completed' && t.completed);
    const matchSearch = t.text.toLowerCase().includes(searchText.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Stats
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-done').textContent    = completed;

  // Empty state
  const list      = document.getElementById('task-list');
  const emptyEl   = document.getElementById('empty-state');

  if (visible.length === 0) {
    list.innerHTML = '';
    emptyEl.classList.add('visible');
    emptyEl.querySelector('p').innerHTML =
      tasks.length === 0
        ? 'No hay tareas.<br>¡Agrega una para empezar!'
        : searchText
          ? `Sin resultados para "<strong>${escapeHtml(searchText)}</strong>".`
          : 'No hay tareas en esta categoría.';
    return;
  }

  emptyEl.classList.remove('visible');

  list.innerHTML = visible.map(task => {
    const date = new Date(task.createdAt).toLocaleString('es-ES', {
      day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'
    });
    return `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-check" onclick="toggleTask('${task.id}')" title="${task.completed ? 'Marcar pendiente' : 'Completar'}">
        ${task.completed ? '✓' : ''}
      </div>
      <div class="task-content">
        <div class="task-text">${escapeHtml(task.text)}</div>
        <div class="task-meta">${date}</div>
      </div>
      <div class="task-actions">
        <button class="task-btn edit-btn" onclick="startEdit('${task.id}')" title="Editar">✏️</button>
        <button class="task-btn delete" onclick="deleteTask('${task.id}')" title="Eliminar">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

// ─────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function updateCharCount(val) {
  document.getElementById('char-count').textContent = `${val.length}/120`;
}

// ─────────────────────────────────────────
//  EVENTS
// ─────────────────────────────────────────
document.getElementById('add-btn').addEventListener('click', addTask);

document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

document.getElementById('task-input').addEventListener('input', e => {
  updateCharCount(e.target.value);
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

document.getElementById('search-input').addEventListener('input', e => {
  handleSearch(e.target.value);
});

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// ─────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────
init();
