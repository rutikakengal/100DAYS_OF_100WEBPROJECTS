function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }
    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.textContent = taskText;
    span.className = "task-text";
    let taskActions = document.createElement("div");
    taskActions.className = "task-actions";
    let completeBtn = document.createElement("button");
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.className = "complete";
    completeBtn.onclick = function() {
        span.classList.toggle("completed");
        completeBtn.classList.toggle("completed-btn");
    };
    let editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.className = "edit";
    editBtn.onclick = function() {
        let newText = prompt("Edit task:", span.textContent);
        if (newText !== null && newText.trim() !== "") {
            span.textContent = newText;
        }
    };
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = "delete";
    deleteBtn.onclick = function() {
        taskList.removeChild(li);
    };
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(taskActions);
    taskList.appendChild(li);
    taskInput.value = "";
}