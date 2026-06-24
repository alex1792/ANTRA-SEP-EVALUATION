// - GET https://dummyjson.com/todos
// - POST https://dummyjson.com/todos/add
// - PUT/PATCH https://dummyjson.com/todos/:id
// - DELETE https://dummyjson.com/todos/:id
async function submitTask(text) {
    // initialize
    const url = 'https://dummyjson.com/todos/add'

    const payload = JSON.stringify({
        todo: text,
        completed: false,
        userId: 5,
    })
    
    // call api
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        });

        if (!response.ok) {
            console.log(`HTTP error, status code ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Success', responseData);

        todos.push(responseData);

        render(todos);
    } catch (error) {
        console.error("Error sending POST segment: ", error);
    }
}

async function editTask(id, row) {
    // edit the task name
    const editBtn = row.querySelector('.edit-btn');

    // is in editing mode, save the task
    if (editBtn.textContent === 'Save') {
        const input = row.querySelector('.todo-input');
        saveTaskTitle(id, input.value.trim());
        return;
    }

    // is not in editing mode, enter the editing mode
    const textElement = row.querySelector('.todo-text');
    const currentText = textElement.textContent;

    const input = document.createElement('input');
    input.className = 'todo-input';
    input.value = currentText;

    textElement.replaceWith(input);
    editBtn.textContent = 'Save';
    input.focus();
}

async function deleteTask(id) {
    // delete the task, can be in pending or completed
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE',
    })

    if (response.ok) {
        await response.json();
    }

    // update the todos list, no matter the response is success or not
    todos = todos.filter(t => t.id !== id);

    render(todos);
}

async function finishTask(id) {
    // only pending tasks, if it's done, user click '->', then move this task to the completed task
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({completed: true}), 
    })

    if (response.ok) {
        const updated = await response.json();
        const idx = todos.findIndex(t => t.id === id);
        todos[idx] = {...todos[idx], ...updated, completed: true};
    } else {
        const idx = todos.findIndex(t => t.id === id);
        if (idx === -1) return;
        todos[idx] = {...todos[idx], completed: true};
    }

    render(todos);
}

async function undoneTask(id) {
    // only completed tasks, if user clicks '<-', then move this task to the pending task
    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({completed: false}), 
    })

    if (response.ok) {
        const updated = await response.json();
        const idx = todos.findIndex(t => t.id === id);
        todos[idx] = {...todos[idx], ...updated, completed: false};
    } else {
        const idx = todos.findIndex(t => t.id === id);
        if (idx === -1) return;
        todos[idx] = {...todos[idx], completed: false};
    }

    render(todos);
}

async function saveTaskTitle(id, newTitle) {
    if (newTitle.length === 0) {
        alert('Please fill in the task name');
        return;
    }

    const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({todo: newTitle}),
    });

    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (response.ok) {
        const updated = await response.json();
        todos[idx] = {...todos[idx], ...updated, todo: newTitle};
    } else {
        todos[idx] = {...todos[idx], todo: newTitle};
    }

    render(todos);
}


let todos = [];

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

function searchTask(taskName) {
    let results = todos.filter(t => t.todo === taskName);
    return results;
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

async function initializeTodos() {
    const data =  await fetch('https://dummyjson.com/todos').then(res => res.json());
    todos = data.todos;
    // console.log(todos);
    render(todos);
}


document.getElementById("submit-btn").addEventListener('click', () => {
    // submit input
    const taskName = document.getElementById("todo-name").value;

    if(taskName.length === 0) {
        alert("Please fill in the task name")
    } else {
        console.log(taskName);
        submitTask(taskName);
    }   
})

document.getElementById('pending-list').addEventListener('click', (e) => {
    const row = e.target.closest('div');

    if (!row) return;

    const id = +row.dataset.id;

    if (e.target.classList.contains('edit-btn')) {
        console.log('edit');
        editTask(id, row);
    } else if (e.target.classList.contains('delete-btn')) {
        console.log('delete');
        deleteTask(id);
    } else if (e.target.classList.contains('task-done-btn')) {
        console.log('done');
        finishTask(id);
    } else if (e.target.classList.contains('task-undone-btn')) {
        console.log('undo');
        undoneTask(id);
    }
})

document.getElementById('completed-list').addEventListener('click', (e) => {
    const row = e.target.closest('div');

    if (!row) return;

    const id = +row.dataset.id;

    if (e.target.classList.contains('edit-btn')) {
        console.log('edit');
        editTask(id, row);
    } else if (e.target.classList.contains('delete-btn')) {
        console.log('delete');
        deleteTask(id);
    } else if (e.target.classList.contains('task-undone-btn')) {
        console.log('undo');
        undoneTask(id);
    }
})

document.getElementById("search-btn").addEventListener('click', (e) => {
    // search the task with the name user input
    const taskName = document.getElementById("search-box").value;
    if (taskName.length === 0) {
        alert("Please fill in the task name");
        return;
    }
    // get input
    // call searchTask
    let results = searchTask(taskName);
    // use the return value to render
    render(results);
})

document.getElementById("clear-btn").addEventListener('click', (e) => {
    document.getElementById("search-box").value = "";
    render(todos);
})

initializeTodos();


// let clientA = new Client();
// let clientB = clientA;
// let clientC = structuredClone(clientA);

// stack: clientA, clientB, clientC
// heap: client123,          client1234