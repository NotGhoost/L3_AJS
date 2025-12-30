// lab4.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

function sortPostsByTitleLength(posts) {
    return posts.sort((a, b) => b.title.length - a.title.length);
}

function sortCommentsByName(comments) {
    return comments.sort((a, b) => a.name.localeCompare(b.name));
}

function filterUserFields(users) {
    return users.map(({ id, name, username, email, phone }) => ({
        id, name, username, email, phone
    }));
}

function filterTodosByCompleted(todos) {
    return todos.filter(todo => !todo.completed);
}

function getPostsWithCallback(callback) {
    fetch(`${BASE_URL}/posts`)
        .then(res => res.json())
        .then(posts => callback(null, sortPostsByTitleLength(posts)))
        .catch(err => callback(err, null));
}

function getCommentsWithCallback(callback) {
    fetch(`${BASE_URL}/comments`)
        .then(res => res.json())
        .then(comments => callback(null, sortCommentsByName(comments)))
        .catch(err => callback(err, null));
}

function getUsersWithPromise() {
    return fetch(`${BASE_URL}/users`)
        .then(res => res.json())
        .then(users => filterUserFields(users));
}

function getTodosWithPromise() {
    return fetch(`${BASE_URL}/todos`)
        .then(res => res.json())
        .then(todos => filterTodosByCompleted(todos));
}

async function getPostsWithAsync() {
    const res = await fetch(`${BASE_URL}/posts`);
    return sortPostsByTitleLength(await res.json());
}

async function getCommentsWithAsync() {
    const res = await fetch(`${BASE_URL}/comments`);
    return sortCommentsByName(await res.json());
}

async function getUsersWithAsync() {
    const res = await fetch(`${BASE_URL}/users`);
    return filterUserFields(await res.json());
}

async function getTodosWithAsync() {
    const res = await fetch(`${BASE_URL}/todos`);
    return filterTodosByCompleted(await res.json());
}

async function runAllTests() {
    console.log('=== КОЛЛБЭКИ ===');
    await new Promise(resolve => {
        getPostsWithCallback((err, posts) => {
            console.log(err ? 'Ошибка /posts:' : 'Успех /posts:', err || posts.slice(0, 2));
            resolve();
        });
    });
    await new Promise(resolve => {
        getCommentsWithCallback((err, comments) => {
            console.log(err ? 'Ошибка /comments:' : 'Успех /comments:', err || comments.slice(0, 2));
            resolve();
        });
    });

    console.log('\n=== ПРОМИСЫ ===');
    getUsersWithPromise()
        .then(users => console.log('Успех /users:', users.slice(0, 2)))
        .catch(err => console.log('Ошибка /users:', err.message));

    await getTodosWithPromise()
        .then(todos => console.log('Успех /todos:', todos.slice(0, 2)))
        .catch(err => console.log('Ошибка /todos:', err.message));

    console.log('\n=== ASYNC/AWAIT ===');
    try {
        console.log('Успех async /posts:', (await getPostsWithAsync()).slice(0, 2));
        console.log('Успех async /comments:', (await getCommentsWithAsync()).slice(0, 2));
        console.log('Успех async /users:', (await getUsersWithAsync()).slice(0, 2));
        console.log('Успех async /todos:', (await getTodosWithAsync()).slice(0, 2));
    } catch (err) {
        console.log('Ошибка async:', err.message);
    }
}

function waitForEnter() {
    return new Promise(resolve => {
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('\nНажмите Enter для выхода...');
        rl.on('line', () => {
            rl.close();
            resolve();
        });
    });
}

(async function main() {
    await runAllTests();
    await waitForEnter();
})();