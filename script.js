const taskInput = document.getElementById("taskInput");
const todoList = document.getElementById("todoList");

// Load theme from localStorage
function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}

// Save theme toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = { text, completed: false };
    const li = createTaskElement(task);
    todoList.appendChild(li);
    saveTasks();
    taskInput.value = "";
}

// Create <li> for a task
function createTaskElement(task) {
    const li = document.createElement("li");
    li.draggable = true;

    const span = document.createElement("span");
    span.textContent = task.text;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete");
    completeBtn.textContent = "✔️";
    completeBtn.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => {
        li.remove();
        saveTasks();
    };

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actions);

    if (task.completed) {
        li.classList.add("completed");
    }

    // Drag events
    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        saveTasks();
    });

    return li;
}

// Drag and drop support
todoList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterEl = getDragAfterElement(todoList, e.clientY);
    if (afterEl == null) {
        todoList.appendChild(dragging);
    } else {
        todoList.insertBefore(dragging, afterEl);
    }
});

function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll("li:not(.dragging)")];
    return items.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
        } else {
        return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Save all tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#todoList li").forEach((li) => {
        tasks.push({
        text: li.querySelector("span").textContent,
        completed: li.classList.contains("completed"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach((task) => {
        const li = createTaskElement(task);
        todoList.appendChild(li);
        });
    }
}

// Enter key support
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

// Init
loadTheme();
loadTasks();
