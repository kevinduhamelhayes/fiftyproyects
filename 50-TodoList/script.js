const form = document.getElementById('form')
const input = document.getElementById('input')
const todosUL = document.getElementById('todos')

const todos = JSON.parse(localStorage.getItem('todos')) || []

// Agregar botones de filtro
const filterContainer = document.createElement('div')
filterContainer.className = 'filter-container'
filterContainer.innerHTML = `
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="active">Active</button>
    <button class="filter-btn" data-filter="completed">Completed</button>
    <button class="clear-completed">Clear Completed</button>
`
form.after(filterContainer)

// Manejar filtros
filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active')
        filterTodos(e.target.dataset.filter)
    }
    if (e.target.classList.contains('clear-completed')) {
        clearCompleted()
    }
})

function filterTodos(filter) {
    const todoItems = todosUL.querySelectorAll('li')
    todoItems.forEach(item => {
        switch(filter) {
            case 'active':
                item.style.display = item.classList.contains('completed') ? 'none' : ''
                break
            case 'completed':
                item.style.display = item.classList.contains('completed') ? '' : 'none'
                break
            default:
                item.style.display = ''
        }
    })
}

function clearCompleted() {
    const completedTodos = todosUL.querySelectorAll('li.completed')
    completedTodos.forEach(todo => todo.remove())
    updateLS()
}

if(todos.length > 0) {
    todos.forEach(todo => addTodo(todo))
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if(input.value.trim() !== '') {
        addTodo()
    } else {
        input.classList.add('error')
        setTimeout(() => input.classList.remove('error'), 1000)
    }
})

function addTodo(todo) {
    let todoText = input.value.trim()

    if(todo) {
        todoText = todo.text
    }

    if(todoText) {
        const todoEl = document.createElement('li')
        if(todo && todo.completed) {
            todoEl.classList.add('completed')
        }

        todoEl.innerText = todoText

        todoEl.addEventListener('click', () => {
            todoEl.classList.toggle('completed')
            updateLS()
        }) 

        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            todoEl.remove()
            updateLS()
        }) 

        todosUL.appendChild(todoEl)
        input.value = ''
        updateLS()
    }
}

function updateLS() {
    const todosEl = document.querySelectorAll('li')
    const todos = []

    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.innerText,
            completed: todoEl.classList.contains('completed')
        })
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}