document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateStats();
        checkEmptyState();
        
        // Set up event listeners
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            showAlert('Please enter a task!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: 'medium', // default priority
            createdAt: new Date().toISOString()
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateStats();
        taskInput.value = '';
        taskInput.focus();
        
        // Show confirmation animation
        addTaskBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => {
            addTaskBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
        }, 1000);
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            checkEmptyState();
            return;
        }
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `fade-in ${task.completed ? 'completed' : ''} priority-${task.priority}`;
            li.dataset.id = task.id;
            
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;
            
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            
            // Complete button
            const completeBtn = document.createElement('button');
            completeBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
            completeBtn.className = 'complete';
            completeBtn.title = task.completed ? 'Mark as active' : 'Complete task';
            completeBtn.onclick = () => toggleComplete(task.id);
            
            // Priority button
            const priorityBtn = document.createElement('button');
            priorityBtn.innerHTML = getPriorityIcon(task.priority);
            priorityBtn.className = 'priority';
            priorityBtn.title = 'Change priority';
            priorityBtn.onclick = () => changePriority(task.id);
            
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.className = 'edit';
            editBtn.title = 'Edit task';
            editBtn.onclick = () => editTask(task.id);
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.className = 'delete';
            deleteBtn.title = 'Delete task';
            deleteBtn.onclick = () => deleteTask(task.id);
            
            taskActions.appendChild(priorityBtn);
            taskActions.appendChild(completeBtn);
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);
            
            li.appendChild(span);
            li.appendChild(taskActions);
            taskList.appendChild(li);
        });
        
        checkEmptyState();
    }
    
    // Toggle task completion status
    function toggleComplete(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        updateStats();
    }
    
    // Change task priority
    function changePriority(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const priorities = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(task.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        task.priority = priorities[nextIndex];
        
        saveTasks();
        renderTasks();
    }
    
    // Get priority icon based on priority level
    function getPriorityIcon(priority) {
        switch (priority) {
            case 'high': return '<i class="fas fa-exclamation"></i>';
            case 'medium': return '<i class="fas fa-equals"></i>';
            case 'low': return '<i class="fas fa-arrow-down"></i>';
            default: return '<i class="fas fa-equals"></i>';
        }
    }
    
    // Edit task text
    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit your task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
    
    // Delete task with confirmation
    function deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        const taskElement = document.querySelector(`li[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('fade-out');
            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
                updateStats();
            }, 300);
        }
    }
    
    // Update task statistics
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        
        totalTasksSpan.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
        completedTasksSpan.textContent = `${completed} completed`;
    }
    
    // Check if task list is empty and show empty state
    function checkEmptyState() {
        const filteredTasks = currentFilter === 'all' ? tasks :
                             currentFilter === 'active' ? tasks.filter(t => !t.completed) :
                             tasks.filter(t => t.completed);
        
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
            taskList.style.display = 'none';
            
            // Update empty state message based on filter
            let message = '';
            if (currentFilter === 'all') message = 'No tasks yet. Add one above!';
            else if (currentFilter === 'active') message = 'No active tasks. Great job!';
            else message = 'No completed tasks yet. Keep going!';
            
            emptyState.querySelector('p').textContent = message;
        } else {
            emptyState.style.display = 'none';
            taskList.style.display = 'block';
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Show alert message
    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert-message';
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 300);
        }, 2000);
    }
    
    // Initialize the application
    init();
});