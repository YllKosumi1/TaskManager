document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    applyDarkMode();
    renderTasks();

    document.getElementById("darkModeToggle")?.addEventListener("click", toggleDarkMode);
    document.getElementById("sortPriority")?.addEventListener("click", sortTasks);
    document.getElementById("clearCompleted")?.addEventListener("click", clearCompleted);
    document.getElementById("search")?.addEventListener("input", (e) => searchTasks(e.target.value));
});


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];


// Sort Tasks by Priority
function sortTasks() {
    const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Clear Completed Tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed); // Keep only incomplete tasks
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Add Task
function addTask() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        alert("You must be logged in to add tasks");
        return;
    }

    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate').value;
    const taskText = taskInput.value.trim();
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    const assignTo = document.getElementById('assignTo').value.trim();

    if (!taskText) {
        alert('Task title is required');
        return;
    }

    const task = { 
        id: Date.now(), 
        title: taskText, 
        completed: false, 
        priority, 
        dueDate, 
        category,
        owner: user.name, 
        completedBy: null,
        assignedTo: assignTo || null
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskInput.value = '';
}

// Render Tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : task.priority}">
                ${task.title} - ${task.category} - Due: ${task.dueDate}
                ${task.completedBy ? ` | Completed by: ${task.completedBy}` : ''}
                ${task.assignedTo ? ` | Assigned to: ${task.assignedTo}` : ''}
            </span>
            <button onclick="toggleTask(${task.id})">Complete</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="assignTask(${task.id})">Assign</button>
        `;
        taskList.appendChild(li);
    });
}

function assignTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;

    const assignee = prompt("Enter the name of the person to assign this task to:");
    if (assignee) {
        task.assignedTo = assignee;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

// Search Tasks
// function searchTasks(query) {
//     console.log("Searching for:", query);  // Debugging line
//     const taskList = document.getElementById("taskList");
//     if (!taskList) return;
//     taskList.innerHTML = '';

//     tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase()))
//         .forEach(task => {
//             const li = document.createElement("li");
//             li.innerHTML = `
//                 <span class="${task.completed ? 'completed' : task.priority}">
//                     ${task.title} - ${task.category} - Due: ${task.dueDate}
//                 </span>
//                 <button onclick="toggleTask(${task.id})">Complete</button>
//                 <button onclick="editTask(${task.id})">Edit</button>
//                 <button onclick="deleteTask(${task.id})">Delete</button>
//             `;
//             taskList.appendChild(li);
//         });
// }



// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Export the function to be used in the test file
module.exports = { addTask, sortTasks, assignTask, deleteTask };


// Toggle Completion
function toggleTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed, completedBy: task.completed ? null : "Test User" };
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Edit Task
function editTask(taskId) {
    const newTitle = prompt("Enter the new task title:");
    if (newTitle) {
        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, title: newTitle } : task
        );
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function filterTasks(category) {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    
    taskList.innerHTML = '';

    tasks
        .filter(task => category === 'all' || task.category.toLowerCase() === category.toLowerCase())
        .forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : task.priority}">
                    ${task.title} - ${task.category} - Due: ${task.dueDate}
                </span>
                <button onclick="toggleTask(${task.id})">Complete</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(li);
        });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function completeAllTasks() {
    tasks.forEach(task => {
        task.completed = true;
        task.completedBy = JSON.parse(localStorage.getItem("currentUser")).name;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
}

function sortByDueDate() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

if (typeof module !== "undefined") {
    module.exports = { sortTasks, clearCompleted, addTask, deleteTask, toggleTask, editTask,clearAllTasks, assignTask };
}
