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

        // Check for duplicate tasks
        const tasks = getTasks();
        const isDuplicate = tasks.some(task => 
            task.text.toLowerCase() === taskText.toLowerCase() && !task.completed
        );
        
        if (isDuplicate) {
            showAlert('This task already exists in your active tasks!');
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
        prioritySelect.value = 'medium';
        updateTaskCount();
        
        // Apply current filter to show/hide new task
        filterTasks();
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id; // FIX: Add data-id attribute
        if (task.completed) li.classList.add('completed');

        const priorityClass = `priority-${task.priority}`;

        // Check if task is overdue
        const isOverdue = task.dueDate && !task.completed && 
                         new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-details">
                    <span class="task-priority ${priorityClass}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    ${task.dueDate ? `
                        <span class="task-due ${isOverdue ? 'overdue' : ''}">
                            <i class="far fa-calendar-alt"></i>
                            ${new Date(task.dueDate).toLocaleDateString()}
                            ${isOverdue ? '<span class="overdue-badge">Overdue</span>' : ''}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
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
            const isCompleted = li.classList.contains('completed');
            updateTaskStatus(task.id, isCompleted);
            updateTaskCount();
            
            // Update button title
            completeBtn.title = isCompleted ? 'Mark as incomplete' : 'Mark as complete';
            
            // Reapply filter to handle completed/active filter views
            setTimeout(() => filterTasks(), 300);
        });

        editBtn.addEventListener('click', function() {
            editTask(task.id, li);
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this task?')) {
                li.classList.add('deleting');
                setTimeout(() => {
                    removeTask(task.id);
                    li.remove();
                    updateTaskCount();
                }, 300);
            }
        });

        taskList.appendChild(li);
    }

    // FIX: Escape HTML to prevent XSS attacks
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function editTask(id, li) {
        const taskText = li.querySelector('.task-text');
        const currentText = taskText.textContent;
        const newText = prompt('Edit your task:', currentText);

        if (newText !== null && newText.trim() !== '' && newText.trim() !== currentText) {
            const trimmedText = newText.trim();
            
            // Check for duplicates
            const tasks = getTasks();
            const isDuplicate = tasks.some(task => 
                task.text.toLowerCase() === trimmedText.toLowerCase() && 
                task.id !== id && 
                !task.completed
            );
            
            if (isDuplicate) {
                showAlert('A task with this name already exists!');
                return;
            }
            
            taskText.textContent = trimmedText;
            updateTaskText(id, trimmedText);
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
        
        updateTaskCount();
    }

    function clearCompletedTasks() {
        const completedTasks = document.querySelectorAll('li.completed');
        if (completedTasks.length === 0) {
            showAlert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Are you sure you want to clear ${completedTasks.length} completed task${completedTasks.length > 1 ? 's' : ''}?`)) {
            completedTasks.forEach(task => {
                const id = parseInt(task.dataset.id); // FIX: Now properly reads data-id
                removeTask(id);
                task.classList.add('deleting');
                setTimeout(() => task.remove(), 300);
            });
            setTimeout(() => updateTaskCount(), 350);
        }
    }

    function updateTaskCount() {
        // Count only visible tasks based on current filter
        const allTasks = document.querySelectorAll('li');
        const completedTasks = document.querySelectorAll('li.completed');
        const totalTasks = allTasks.length;
        const activeTasks = totalTasks - completedTasks.length;

        if (currentFilter === 'all') {
            taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
        } else if (currentFilter === 'active') {
            taskCount.textContent = `${activeTasks} active ${activeTasks === 1 ? 'task' : 'tasks'}`;
        } else if (currentFilter === 'completed') {
            taskCount.textContent = `${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}`;
        }
    }

    // LocalStorage functions with error handling
    function saveTask(task) {
        try {
            const tasks = getTasks();
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save task:', e);
            showAlert('Failed to save task. Storage might be full.');
        }
    }

    function getTasks() {
        try {
            return JSON.parse(localStorage.getItem('tasks')) || [];
        } catch (e) {
            console.error('Failed to load tasks:', e);
            return [];
        }
    }

    function loadTasks() {
        const tasks = getTasks();
        
        // Sort tasks: incomplete first, then by priority, then by due date
        tasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            
            return 0;
        });
        
        tasks.forEach(task => createTaskElement(task));
        updateTaskCount();
    }

    function updateTaskStatus(id, completed) {
        try {
            const tasks = getTasks();
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        } catch (e) {
            console.error('Failed to update task status:', e);
        }
    }

    function updateTaskText(id, newText) {
        try {
            const tasks = getTasks();
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex !== -1) {
                tasks[taskIndex].text = newText;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        } catch (e) {
            console.error('Failed to update task text:', e);
        }
    }

    function removeTask(id) {
        try {
            let tasks = getTasks();
            tasks = tasks.filter(task => task.id !== id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to remove task:', e);
        }
    }

    function showAlert(message) {
        alert(message);
    }
    
    // Check for overdue tasks on load
    checkOverdueTasks();
    
    function checkOverdueTasks() {
        const tasks = getTasks();
        const today = new Date().setHours(0, 0, 0, 0);
        const overdueTasks = tasks.filter(task => 
            task.dueDate && !task.completed && new Date(task.dueDate) < today
        );
        
        if (overdueTasks.length > 0) {
            console.log(`You have ${overdueTasks.length} overdue task(s)`);
        }
    }
});