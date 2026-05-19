// ─────────────────────────────────────────
//  CLAVES DE STORAGE
// ─────────────────────────────────────────
const LS_TASKS  = 'ws_tasks';
const LS_THEME  = 'ws_dark_mode';
const SS_FILTER = 'ws_filter';
const SS_SEARCH = 'ws_search';
const SS_BANNER = 'ws_banner_dismissed';

// ─────────────────────────────────────────
//  ESTADO GLOBAL
// ─────────────────────────────────────────
let tasks = [];
let currentFilter = 'all';
let searchText = '';

// ─────────────────────────────────────────
//  FUNCIONES DE PERSISTENCIA
// ─────────────────────────────────────────
function saveTasks() {
  localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem(LS_TASKS) || '[]');
}

function saveFilter(filter) {
  currentFilter = filter;
  sessionStorage.setItem(SS_FILTER, filter);
}

function loadFilter() {
  currentFilter = sessionStorage.getItem(SS_FILTER) || 'all';
}

function saveSearch(value) {
  searchText = value;
  sessionStorage.setItem(SS_SEARCH, value);
}

function loadSearch() {
  searchText = sessionStorage.getItem(SS_SEARCH) || '';
}
