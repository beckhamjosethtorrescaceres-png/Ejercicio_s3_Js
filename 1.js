let tasks = [];

function init() {
  const isDark = localStorage.getItem("dark_mode") === "true";
  applyTheme(isDark);

  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }

  render();
}

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  applyTheme(!isDark);
  localStorage.setItem("dark_mode", String(!isDark));
}

function addTask() {
  const input = document.getElementById("input");
  const text = input.value;

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  render();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function setFilter(filtro) {
  sessionStorage.setItem("filtro_activo", filtro);
  render();
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const filtro = sessionStorage.getItem("filtro_activo") || "todas";

  tasks.forEach((task, index) => {

    if (filtro === "pendientes"  && task.completed === true)  return;
    if (filtro === "completadas" && task.completed === false) return;

    list.innerHTML += `
      <div>
        <span onclick="toggleTask(${index})">
          ${task.completed ? "✅" : "⬜"}
        </span>
        ${task.text}
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;
  });
}

init();