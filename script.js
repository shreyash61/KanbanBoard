let tasksData = {};

const todo = document.querySelector("#To-do");
const progress = document.querySelector("#Progress");
const done = document.querySelector("#done");

let dragElement = null;
const columns = [todo, progress, done];

function getColumnTasks(column) {
    return column.querySelectorAll(".task");
}

function initializeTasksData() {
    tasksData = {};
    columns.forEach(col => {
        if (!col) return;
        tasksData[col.id] = [];
    });
}

// =======================
// ADD TASK
// =======================

function addTask(title, desc, column) {

    if (!column) return;

    const div = document.createElement("div");
    div.classList.add("task");
    div.draggable = true;

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    column.appendChild(div);

    div.addEventListener("dragstart", () => {
        dragElement = div;
    });

    const deleteButton = div.querySelector("button");

    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}


// =======================
// UPDATE TASK COUNT + SAVE
// =======================

function updateTaskCount() {

    columns.forEach(col => {

        if (!col) return;

        const tasks = getColumnTasks(col);
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector("h2").innerText,
            desc: t.querySelector("p").innerText
        }));

        if (count) {
            count.innerText = tasks.length;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}


// =======================
// LOAD FROM LOCAL STORAGE
// =======================

function loadTasks() {
    initializeTasksData();

    columns.forEach(col => {
        if (!col) return;
        getColumnTasks(col).forEach(task => task.remove());
    });

    const raw = localStorage.getItem("tasks");
    if (!raw) {
        updateTaskCount();
        return;
    }

    const data = JSON.parse(raw);

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        if (!column) continue;

        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        });
    }

    updateTaskCount();
}

loadTasks();


// =======================
// DRAG & DROP LOGIC
// =======================

columns.forEach(section => {

    if (!section) return;

    section.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    section.addEventListener("dragenter", () => {
        section.classList.add("hover-over");
    });

    section.addEventListener("dragleave", () => {
        section.classList.remove("hover-over");
    });

    section.addEventListener("drop", (e) => {

        e.preventDefault();

        if (dragElement) {
            section.appendChild(dragElement);
            section.classList.remove("hover-over");
            updateTaskCount();
        }
    });

});


// =======================
// MODAL LOGIC
// =======================

const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".bg");
const addTaskButton = document.querySelector("#add-new-task");

if (toggleModalButton) {
    toggleModalButton.addEventListener("click", () => {
        modal.classList.toggle("active");
    });
}

if (modalBg) {
    modalBg.addEventListener("click", () => {
        modal.classList.remove("active");
    });
}

if (addTaskButton) {
    addTaskButton.addEventListener("click", () => {

        const taskTitleInput = document.querySelector('#task-title-input');
        const taskDescInput = document.querySelector('#task-desc-input');
        const taskTitle = taskTitleInput.value;
        const taskDesc = taskDescInput.value;

        if (taskTitle.trim() === "") return;

        addTask(taskTitle, taskDesc, todo);
        updateTaskCount();
        taskTitleInput.value = "";
        taskDescInput.value = "";

        modal.classList.remove("active");
    });
}
