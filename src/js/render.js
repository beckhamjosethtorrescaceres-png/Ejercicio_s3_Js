// ─────────────────────────────────────────
//  RENDER — Manipulación del DOM
//  Depende de: storage.js
// ─────────────────────────────────────────

function render() {
  const visible = tasks.filter(t => {
    const matchFilter =
      currentFilter === 'all' ||
      (currentFilter === 'pending'   && !t.completed) ||
      (currentFilter === 'completed' && t.completed);
    const matchSearch = t.text.toLowerCase().includes(searchText.toLowerCase());
    return matchFilter && matchSearch;
  });

  renderStats();
  renderList(visible);
}

function renderStats() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-done').textContent    = completed;
}

function renderList(visible) {
  const list    = document.getElementById('task-list');
  const emptyEl = document.getElementById('empty-state');

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
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
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
//  HELPERS DE DOM
// ─────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function updateCharCount(val) {
  document.getElementById('char-count').textContent = `${val.length}/120`;
}
