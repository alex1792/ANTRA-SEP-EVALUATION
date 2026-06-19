function createPendingRow(todo) {
    const row = document.createElement("div");
    row.className = "todo-row";
    row.dataset.id = todo.id;

    row.innerHTML = `
        <p class="todo-text">${todo.todo}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="task-done-btn">Done</button>
    `;

    return row;
}

function createCompletedRow(todo) {
    const row = document.createElement("div");
    row.className = "todo-row";
    row.dataset.id = todo.id;

    row.innerHTML = `
        <button class="task-undone-btn">Undo</button>
        <p class="todo-text">${todo.todo}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    return row;
}

function render(todos) {
    // initialize the todo list
    const pendingList = document.getElementById("pending-list");
    const completedList = document.getElementById("completed-list");

    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach(todo => {
        if (todo.completed) {
            // completed task
            completedList.appendChild(createCompletedRow(todo));
        } else {
            // pending task
            pendingList.appendChild(createPendingRow(todo));
        }
    })
}