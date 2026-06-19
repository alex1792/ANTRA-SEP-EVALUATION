function fetchTodos() {
    return fetch('https://dummyjson.com/todos').then(res => res.json());
}

function addTodo(text) {
    // initialize
    const url = 'https://dummyjson.com/todos/add'

    const payload = JSON.stringify({
        todo: text,
        completed: false,
        userId: 5,
    })
    
   return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
    }).then(res => res.json());
}

function updateTodo(id, body) {
    return fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    });
}

function deleteTodo(id) {
    return fetch(`https://dummyjson.com/todos/${id}`, {method: 'DELETE',})
}