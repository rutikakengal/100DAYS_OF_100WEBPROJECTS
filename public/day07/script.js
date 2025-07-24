const form = document.getElementById('form');
const saveBtn = document.getElementById('save-btn');

const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionsList = document.querySelector('.list');

const balanceDisplay = document.querySelector('.total-balance-div p');
const incomeDisplay = document.querySelector('.income-expense-div div:nth-child(1) p');
const expenseDisplay = document.querySelector('.income-expense-div div:nth-child(2) p');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

let totalBalance = 0;
let totalIncome = 0;
let totalExpenses = 0;


function addTransaction(description, amount, type){
    const transaction = {
    id: Date.now(),
    description,
    amount,
    type
  };

  transactions.push(transaction);
  saveTransactions();
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateUI() {
      transactionsList.innerHTML = '';

  totalBalance = 0;
  totalIncome = 0;
  totalExpenses = 0;

  transactions.forEach((t) => {
    const li = document.createElement('li');
    li.classList.add('list-items');
    li.innerHTML = `
      <span>${t.description}</span>
      <span>${t.type === 'income' ? '+' : '-'}₹${t.amount.toFixed(2)}</span>
    `;
    transactionsList.appendChild(li);

    if (t.type === 'income') {
      totalIncome += t.amount;
      totalBalance += t.amount;
    } else {
      totalExpenses += t.amount;
      totalBalance -= t.amount;
    }
  });

  balanceDisplay.textContent = `Balance: ₹${totalBalance.toFixed(2)}`;
  incomeDisplay.textContent = `Income: ₹${totalIncome.toFixed(2)}`;
  expenseDisplay.textContent = `Expenses: ₹${totalExpenses.toFixed(2)}`;

}

saveBtn.addEventListener('click', () => {
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;

  if (description === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid description and amount.');
    return;
  }

  addTransaction(description, amount, type);
  updateUI();

  descInput.value = '';
  amountInput.value = '';
  form.classList.add('hidden');
});


updateUI();