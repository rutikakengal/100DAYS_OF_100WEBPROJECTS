document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(); // Re-render tasks after saving
        toggleClearCompletedButton();
    }

    // Function to render tasks on the page
    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="actions">
                    <button class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? '&#10003;' : '&#10003;'} </button>
                    <button class="action-btn delete-btn" data-index="${index}">
                        &#x2715; </button>
                </div>
            `;
            taskList.appendChild(li);
        });
        toggleClearCompletedButton();
    }

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
        }
    }

    // Function to toggle task completion
    function toggleTaskComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
    }

    // Function to delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
    }

    // Function to clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
    }

    // Function to show/hide the "Clear Completed" button
    function toggleClearCompletedButton() {
        const completedTasksExist = tasks.some(task => task.completed);
        if (completedTasksExist) {
            clearCompletedBtn.classList.remove('hidden');
        } else {
            clearCompletedBtn.classList.add('hidden');
        }
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('complete-btn')) {
            const index = target.dataset.index;
            toggleTaskComplete(index);
        } else if (target.classList.contains('delete-btn')) {
            const index = target.dataset.index;
            deleteTask(index);
        } else if (target.classList.contains('task-text')) {
             const index = target.nextElementSibling.querySelector('.complete-btn').dataset.index;
             toggleTaskComplete(index);
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Initial render when the page loads
    renderTasks();
});