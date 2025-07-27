const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTodo();
});

function addTodo() {
  const value = todoInput.value.trim();
  if (value === "") return;
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = `
    <span class="todo-title">${escapeHtml(value)}</span>
    <button class="edit-btn" title="Edit">&#9998;</button>
    <button class="delete-btn" title="Delete">&times;</button>
  `;
  todoList.appendChild(li);
  todoInput.value = "";

  li.querySelector('.todo-title').addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  li.querySelector('.delete-btn').addEventListener('click', () => {
    todoList.removeChild(li);
  });

  const editBtn = li.querySelector('.edit-btn');
  editBtn.addEventListener('click', () => {
    startEdit(li);
  });
}

function startEdit(li) {
  const titleSpan = li.querySelector('.todo-title');
  const currentText = titleSpan.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;
  input.className = 'edit-input';
  li.insertBefore(input, titleSpan);
  titleSpan.style.display = 'none';
  input.focus();

  function finishEdit() {
    const newValue = input.value.trim();
    if (newValue) {
      titleSpan.textContent = escapeHtml(newValue);
    }
    titleSpan.style.display = '';
    input.remove();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') finishEdit();
    if (e.key === 'Escape') {
      input.value = currentText;
      finishEdit();
    }
  });
  input.addEventListener('blur', finishEdit);
}

function escapeHtml(string) {
  return string.replace(/[&<>"']/g, function (m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}
