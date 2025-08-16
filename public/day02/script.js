document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const dueDate = document.getElementById('dueDate');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const taskCount = document.getElementById('taskCount');

    // Current filter
    let currentFilter = 'all';

    // Load tasks from localStorage
    loadTasks();

    // Add task event
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    // Filter events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterTasks();
        });
    });

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            showAlert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            priority: prioritySelect.value,
            dueDate: dueDate.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        createTaskElement(task);
        saveTask(task);
        taskInput.value = '';
        dueDate.value = '';
        updateTaskCount();
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const priorityClass = `priority-${task.priority}`;

        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <div class="task-details">
                    <span class="task-priority ${priorityClass}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    ${task.dueDate ? `
                        <span class="task-due">
                            <i class="far fa-calendar-alt"></i>
                            ${new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" title="Complete">
                    <i class="fas fa-check"></i>
                </button>
                <button class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const completeBtn = li.querySelector('.complete-btn');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        completeBtn.addEventListener('click', function() {
            li.classList.toggle('completed');
            updateTaskStatus(task.id, li.classList.contains('completed'));
            updateTaskCount();
        });

        editBtn.addEventListener('click', function() {
            editTask(task.id, li);
        });

        deleteBtn.addEventListener('click', function() {
            li.classList.add('deleting');
            setTimeout(() => {
                removeTask(task.id);
                li.remove();
                updateTaskCount();
            }, 300);
        });

        taskList.appendChild(li);
    }

    function editTask(id, li) {
        const taskText = li.querySelector('.task-text');
        const currentText = taskText.textContent;
        const newText = prompt('Edit your task:', currentText);

        if (newText !== null && newText.trim() !== '') {
            taskText.textContent = newText.trim();
            updateTaskText(id, newText.trim());
        }
    }

    function filterTasks() {
        const tasks = document.querySelectorAll('li');
        tasks.forEach(task => {
            const isCompleted = task.classList.contains('completed');
            
            if (currentFilter === 'all') {
                task.style.display = 'flex';
            } else if (currentFilter === 'active' && !isCompleted) {
                task.style.display = 'flex';
            } else if (currentFilter === 'completed' && isCompleted) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function clearCompletedTasks() {
        const completedTasks = document.querySelectorAll('li.completed');
        if (completedTasks.length === 0) {
            showAlert('No completed tasks to clear!');
            return;
        }

        if (confirm('Are you sure you want to clear all completed tasks?')) {
            completedTasks.forEach(task => {
                const id = parseInt(task.dataset.id);
                removeTask(id);
                task.classList.add('deleting');
                setTimeout(() => task.remove(), 300);
            });
            updateTaskCount();
        }
    }

    function updateTaskCount() {
        const totalTasks = document.querySelectorAll('li').length;
        const completedTasks = document.querySelectorAll('li.completed').length;
        const activeTasks = totalTasks - completedTasks;

        taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
    }

    // LocalStorage functions
    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => createTaskElement(task));
        updateTaskCount();
    }

    function updateTaskStatus(id, completed) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function updateTaskText(id, newText) {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function removeTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showAlert(message) {
        alert(message);
    }
});