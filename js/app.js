async function submitTask(text) {
    // call api
    try {
        const responseData = await addTodo(text);
        console.log('Success', responseData);
        todos.push(responseData);
        persistTodos();
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
    const response = await deleteTodo(id);

    if (response.ok) {
        await response.json();
    }

    // update the todos list, no matter the response is success or not
    todos = todos.filter(t => t.id !== id);

    persistTodos();

    render(todos);
}

async function finishTask(id) {
    // only pending tasks, if it's done, user click '->', then move this task to the completed task
    const response = await updateTodo(id, {completed: true})

    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (response.ok) {
        const updated = await response.json();
        todos[idx] = {...todos[idx], ...updated, completed: true};
    } else {
        todos[idx] = {...todos[idx], completed: true};
    }

    persistTodos();

    render(todos);
}

async function undoneTask(id) {
    // only completed tasks, if user clicks '<-', then move this task to the pending task
    const response = await updateTodo(id, {completed: false});

    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (response.ok) {
        const updated = await response.json();
        todos[idx] = {...todos[idx], ...updated, completed: false};
    } else {
        todos[idx] = {...todos[idx], completed: false};
    }

    persistTodos();

    render(todos);
}

async function saveTaskTitle(id, newTitle) {
    if (newTitle.length === 0) {
        alert('Please fill in the task name');
        return;
    }

    const response = await updateTodo(id, {todo: newTitle});

    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (response.ok) {
        const updated = await response.json();
        todos[idx] = {...todos[idx], ...updated, todo: newTitle};
    } else {
        todos[idx] = {...todos[idx], todo: newTitle};
    }

    persistTodos();
    
    render(todos);
}

async function initializeTodos() {
    // load from local storage, the function will return the cached todos
    // if the cached todos are not expired
    const cachedTodos = loadTodosFromLocalStorage();
    if (cachedTodos) {
        console.log('Initialized:Loaded from local storage');
        setTodos(cachedTodos);
        render(todos);
        return;
    }
    
    
    const data = await fetchTodos();
    localStorage.setItem('todos', JSON.stringify(data.todos));
    
    // update todos --> write to local storage --> render
    setTodos(data.todos);
    persistTodos();
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

initializeTodos();