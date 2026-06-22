const OLD_TODOS_KEY = 'todos';
const EXPIRE_MS = 6 * 1000; // 6 seconds

let todos = [];

function setTodos(newTodos) {
    todos = newTodos;
    saveTodos();
}

function persistTodos() {
    saveTodos();
}

function saveTodos() {
    localStorage.setItem(OLD_TODOS_KEY, JSON.stringify({
        todos,
        savedAt: Date.now(),
    }));
    console.log('Saved to local storage');
}

function loadTodosFromLocalStorage() {
    const oldTodos = localStorage.getItem(OLD_TODOS_KEY);

    if (!oldTodos) return;

    try {
        const parsed = JSON.parse(oldTodos);
        if (Date.now() - parsed.savedAt > EXPIRE_MS) {
            // expired
            console.log('Expired');
            localStorage.removeItem(OLD_TODOS_KEY)
            return null;
        }

        return parsed.todos;
    } catch {
        localStorage.removeItem(OLD_TODOS_KEY);
        return null;
    }
}