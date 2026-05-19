// ─────────────────────────────────────────
//  LÓGICA DE TAREAS
//  Depende de: storage.js, render.js
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

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

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

function startEdit(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  const task = tasks.find(t => t.id === id);
  if (!el || !task) return;

  const textEl = el.querySelector('.task-text');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = task.text;
  input.maxLength = 120;

  textEl.replaceWith(input);
  input.focus();
  input.select();

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
