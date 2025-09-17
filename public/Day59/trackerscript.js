// DOM Elements
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const type = document.getElementById("type");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const filterBtns = document.querySelectorAll(".filter-btn");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");
const dateFrom = document.getElementById("date-from");
const dateTo = document.getElementById("date-to");
const amountMin = document.getElementById("amount-min");
const amountMax = document.getElementById("amount-max");
const clearFiltersBtn = document.getElementById("clear-filters");
const exportCsvBtn = document.getElementById("export-csv");
const exportJsonBtn = document.getElementById("export-json");
const importFileInput = document.getElementById("import-file");
const importDataBtn = document.getElementById("import-data");
const mergeDataCheckbox = document.getElementById("merge-data");

// State Management
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
let currentFilter = 'all';
let currentCategoryFilter = 'all';
let searchQuery = '';
let dateRange = { from: null, to: null };
let amountRange = { min: null, max: null };

// Category definitions
const categories = {
  food: { name: '🍽️ Food & Dining', color: '#FF6B6B' },
  transport: { name: '🚗 Transportation', color: '#4ECDC4' },
  shopping: { name: '🛒 Shopping', color: '#45B7D1' },
  entertainment: { name: '🎬 Entertainment', color: '#96CEB4' },
  bills: { name: '💡 Bills & Utilities', color: '#FECA57' },
  healthcare: { name: '🏥 Healthcare', color: '#FF9FF3' },
  education: { name: '📚 Education', color: '#54A0FF' },
  travel: { name: '✈️ Travel', color: '#5F27CD' },
  salary: { name: '💼 Salary', color: '#00D2D3' },
  freelance: { name: '💻 Freelance', color: '#FF9F43' },
  investment: { name: '📈 Investment', color: '#10AC84' },
  other: { name: '📋 Other', color: '#A55EEA' }
};

// Mobile Navigation
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

// Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // Add active class to clicked link
    link.classList.add('active');
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
    
    // Smooth scroll to section if it exists
    const targetId = link.getAttribute('href');
    if (targetId.startsWith('#')) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Filter functionality
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    // Set current filter
    currentFilter = btn.getAttribute('data-filter');
    
    // Re-render transactions with filter
    displayTransactions();
  });
});

// Category filter functionality
if (categoryFilter) {
  categoryFilter.addEventListener('change', () => {
    currentCategoryFilter = categoryFilter.value;
    displayTransactions();
  });
}

// Transaction type change handler
if (type) {
  type.addEventListener('change', () => {
    // Auto-set amount sign based on type
    const amountInput = document.getElementById('amount');
    if (type.value === 'expense' && amountInput.value > 0) {
      amountInput.value = -Math.abs(amountInput.value);
    } else if (type.value === 'income' && amountInput.value < 0) {
      amountInput.value = Math.abs(amountInput.value);
    }
  });
}

// Search functionality
if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    displayTransactions();
  });
}

// Date range filters
if (dateFrom) {
  dateFrom.addEventListener('change', () => {
    dateRange.from = dateFrom.value ? new Date(dateFrom.value) : null;
    displayTransactions();
  });
}

if (dateTo) {
  dateTo.addEventListener('change', () => {
    dateRange.to = dateTo.value ? new Date(dateTo.value + 'T23:59:59') : null;
    displayTransactions();
  });
}

// Amount range filters
if (amountMin) {
  amountMin.addEventListener('input', () => {
    amountRange.min = amountMin.value ? parseFloat(amountMin.value) : null;
    displayTransactions();
  });
}

if (amountMax) {
  amountMax.addEventListener('input', () => {
    amountRange.max = amountMax.value ? parseFloat(amountMax.value) : null;
    displayTransactions();
  });
}

// Clear filters functionality
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    // Reset all filters
    currentFilter = 'all';
    currentCategoryFilter = 'all';
    searchQuery = '';
    dateRange = { from: null, to: null };
    amountRange = { min: null, max: null };
    
    // Reset UI elements
    filterBtns.forEach(btn => btn.classList.remove('active'));
    filterBtns[0].classList.add('active'); // Set 'All' as active
    
    if (categoryFilter) categoryFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    if (dateFrom) dateFrom.value = '';
    if (dateTo) dateTo.value = '';
    if (amountMin) amountMin.value = '';
    if (amountMax) amountMax.value = '';
    
    displayTransactions();
    showNotification('All filters cleared', 'info');
  });
}

// Export to CSV functionality
if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', () => {
    exportDataToCSV();
  });
}

// Export to JSON functionality
if (exportJsonBtn) {
  exportJsonBtn.addEventListener('click', () => {
    exportDataToJSON();
  });
}

// Import file selection
if (importFileInput) {
  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importDataBtn.disabled = false;
      importDataBtn.textContent = `Import ${file.name}`;
    } else {
      importDataBtn.disabled = true;
      importDataBtn.innerHTML = '<i class="fas fa-download"></i> Import Data';
    }
  });
}

// Import data functionality
if (importDataBtn) {
  importDataBtn.addEventListener('click', () => {
    const file = importFileInput.files[0];
    if (file) {
      importDataFromFile(file);
    }
  });
}
  
// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  
  if (text.value.trim() === '' || amount.value.trim() === '' || !category.value || !type.value) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  if (isNaN(amount.value) || amount.value === '0') {
    showNotification('Please enter a valid amount', 'error');
    return;
  }
  
  let transactionAmount = +amount.value;
  
  // Ensure amount sign matches transaction type
  if (type.value === 'expense' && transactionAmount > 0) {
    transactionAmount = -transactionAmount;
  } else if (type.value === 'income' && transactionAmount < 0) {
    transactionAmount = Math.abs(transactionAmount);
  }
  
  const transaction = {
    id: generateID(),
    text: text.value.trim(),
    amount: transactionAmount,
    category: category.value,
    type: type.value,
    date: new Date().toISOString()
  };
  
  transactions.push(transaction);
  
  displayTransactions();
  updateValues();
  updateLocalStorage();
  
  // Clear form
  text.value = '';
  amount.value = '';
  category.value = '';
  type.value = '';
  
  // Show success notification
  showNotification(`${type.value.charAt(0).toUpperCase() + type.value.slice(1)} added successfully!`, 'success');
}
  
// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Filter transactions based on current filter
function getFilteredTransactions() {
  let filtered = transactions;
  
  // Filter by transaction type
  switch(currentFilter) {
    case 'income':
      filtered = filtered.filter(transaction => transaction.amount > 0);
      break;
    case 'expense':
      filtered = filtered.filter(transaction => transaction.amount < 0);
      break;
  }
  
  // Filter by category
  if (currentCategoryFilter !== 'all') {
    filtered = filtered.filter(transaction => transaction.category === currentCategoryFilter);
  }
  
  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(transaction => {
      const searchText = transaction.text.toLowerCase();
      const categoryName = categories[transaction.category]?.name.toLowerCase() || '';
      return searchText.includes(searchQuery) || categoryName.includes(searchQuery);
    });
  }
  
  // Filter by date range
  if (dateRange.from || dateRange.to) {
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (dateRange.from && transactionDate < dateRange.from) {
        return false;
      }
      
      if (dateRange.to && transactionDate > dateRange.to) {
        return false;
      }
      
      return true;
    });
  }
  
  // Filter by amount range
  if (amountRange.min !== null || amountRange.max !== null) {
    filtered = filtered.filter(transaction => {
      const absAmount = Math.abs(transaction.amount);
      
      if (amountRange.min !== null && absAmount < amountRange.min) {
        return false;
      }
      
      if (amountRange.max !== null && absAmount > amountRange.max) {
        return false;
      }
      
      return true;
    });
  }
  
  return filtered;
}

// Display transactions with filtering
function displayTransactions() {
  list.innerHTML = '';
  
  const filteredTransactions = getFilteredTransactions();
  
  if (filteredTransactions.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-state';
    emptyMessage.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No ${currentFilter === 'all' ? '' : currentFilter} transactions found.</p>
        <small>Start by adding your first transaction below.</small>
      </div>
    `;
    list.appendChild(emptyMessage);
    return;
  }
  
  filteredTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(transaction => addTransactionDOM(transaction));
}

// Add single transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  
  const date = new Date(transaction.date || Date.now());
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  const categoryInfo = categories[transaction.category] || categories.other;
  
  item.innerHTML = `
    <div class="transaction-content">
      <div class="transaction-main">
        <span class="transaction-text">${transaction.text}</span>
        <span class="transaction-amount">₹${Math.abs(transaction.amount).toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
        <span class="transaction-category" style="background-color: ${categoryInfo.color}20; color: ${categoryInfo.color}; border: 1px solid ${categoryInfo.color}40;">
          ${categoryInfo.name}
        </span>
        <div class="transaction-date">${formattedDate}</div>
      </div>
    </div>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
      <i class="fas fa-trash"></i>
    </button>
  `;
  
  list.appendChild(item);
}
// Update the balance, income, and expense displays
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  
  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0);
  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0) * -1;
  
  // Format numbers with proper currency symbol
  balance.innerHTML = `₹${total.toFixed(2)}`;
  money_plus.innerHTML = `+₹${income.toFixed(2)}`;
  money_minus.innerHTML = `-₹${expense.toFixed(2)}`;
  
  // Add visual feedback for balance state
  const balanceCard = document.querySelector('.balance-card');
  if (balanceCard) {
    balanceCard.classList.remove('positive', 'negative', 'neutral');
    if (total > 0) {
      balanceCard.classList.add('positive');
    } else if (total < 0) {
      balanceCard.classList.add('negative');
    } else {
      balanceCard.classList.add('neutral');
    }
  }
}

// Remove Transaction by ID
function removeTransaction(id) {
  const transactionToRemove = transactions.find(t => t.id === id);
  if (!transactionToRemove) return;
  
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  displayTransactions();
  updateValues();
  
  // Show notification
  showNotification('Transaction deleted successfully', 'success');
}

// Update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add notification styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    background: type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                'rgba(33, 150, 243, 0.9)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: '10000',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '300px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.3s ease-out'
  });
  
  // Add close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Add to document
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// Initialize App
function Init() {
  displayTransactions();
  updateValues();
  
  // Add some demo data if no transactions exist
  if (transactions.length === 0) {
    const demoTransactions = [
      { id: generateID(), text: 'Salary', amount: 50000, date: new Date().toISOString() },
      { id: generateID(), text: 'Groceries', amount: -2500, date: new Date(Date.now() - 86400000).toISOString() },
      { id: generateID(), text: 'Freelance Project', amount: 15000, date: new Date(Date.now() - 172800000).toISOString() },
      { id: generateID(), text: 'Electricity Bill', amount: -1200, date: new Date(Date.now() - 259200000).toISOString() }
    ];
    
    // Uncomment the next line to add demo data
    // transactions = demoTransactions;
    // updateLocalStorage();
    // displayTransactions();
    // updateValues();
  }
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }
  
  .notification-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
document.head.appendChild(notificationStyles);

// Export data to CSV
function exportDataToCSV() {
  if (transactions.length === 0) {
    showNotification('No data to export', 'warning');
    return;
  }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const csvContent = [headers.join(',')];

  transactions.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString('en-IN');
    const categoryName = categories[transaction.category]?.name.replace(/[^\w\s]/gi, '') || 'Other';
    const type = transaction.amount > 0 ? 'Income' : 'Expense';
    const amount = Math.abs(transaction.amount).toFixed(2);
    
    const row = [
      `"${date}"`,
      `"${transaction.text.replace(/"/g, '""')}"`,
      `"${categoryName}"`,
      `"${type}"`,
      amount
    ];
    csvContent.push(row.join(','));
  });

  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Data exported to CSV successfully', 'success');
}

// Export data to JSON
function exportDataToJSON() {
  if (transactions.length === 0) {
    showNotification('No data to export', 'warning');
    return;
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    totalTransactions: transactions.length,
    transactions: transactions
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `expense-tracker-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Data exported to JSON successfully', 'success');
}

// Import data from file
function importDataFromFile(file) {
  const reader = new FileReader();
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  reader.onload = function(e) {
    try {
      let importedTransactions = [];
      
      if (fileExtension === 'json') {
        const data = JSON.parse(e.target.result);
        importedTransactions = data.transactions || data;
      } else if (fileExtension === 'csv') {
        importedTransactions = parseCSV(e.target.result);
      } else {
        throw new Error('Unsupported file format');
      }
      
      // Validate imported data
      const validTransactions = importedTransactions.filter(transaction => {
        return transaction.text && 
               typeof transaction.amount === 'number' && 
               transaction.date;
      });
      
      if (validTransactions.length === 0) {
        showNotification('No valid transactions found in file', 'error');
        return;
      }
      
      // Add IDs to transactions that don't have them
      validTransactions.forEach(transaction => {
        if (!transaction.id) {
          transaction.id = generateID();
        }
        if (!transaction.category) {
          transaction.category = 'other';
        }
        if (!transaction.type) {
          transaction.type = transaction.amount > 0 ? 'income' : 'expense';
        }
      });
      
      // Merge or replace data based on checkbox
      if (mergeDataCheckbox.checked) {
        transactions.push(...validTransactions);
        showNotification(`Successfully imported and merged ${validTransactions.length} transactions`, 'success');
      } else {
        transactions = validTransactions;
        showNotification(`Successfully imported ${validTransactions.length} transactions (existing data replaced)`, 'success');
      }
      
      // Update UI and storage
      updateLocalStorage();
      displayTransactions();
      updateValues();
      
      // Reset import controls
      importFileInput.value = '';
      importDataBtn.disabled = true;
      importDataBtn.innerHTML = '<i class="fas fa-download"></i> Import Data';
      
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Error importing data: ' + error.message, 'error');
    }
  };
  
  reader.readAsText(file);
}

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim().toLowerCase());
  const transactions = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const values = parseCSVLine(line);
      if (values.length >= 5) {
        const transaction = {
          id: generateID(),
          date: new Date(values[0]).toISOString(),
          text: values[1],
          category: getCategoryFromName(values[2]),
          type: values[3].toLowerCase(),
          amount: values[3].toLowerCase() === 'expense' ? -parseFloat(values[4]) : parseFloat(values[4])
        };
        
        if (!isNaN(transaction.amount) && transaction.text) {
          transactions.push(transaction);
        }
      }
    }
  }
  
  return transactions;
}

// Parse CSV line (handles quoted values)
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

// Get category key from category name
function getCategoryFromName(categoryName) {
  const cleanName = categoryName.toLowerCase().replace(/[^\w\s]/gi, '');
  for (const [key, category] of Object.entries(categories)) {
    if (category.name.toLowerCase().replace(/[^\w\s]/gi, '').includes(cleanName) || 
        cleanName.includes(key)) {
      return key;
    }
  }
  return 'other';
}

// PWA Installation
let deferredPrompt;
const installPrompt = document.getElementById('install-prompt');
const installButton = document.getElementById('install-button');
const installDismiss = document.getElementById('install-dismiss');
const offlineIndicator = document.getElementById('offline-indicator');
const updateNotification = document.getElementById('update-notification');
const updateButton = document.getElementById('update-button');

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt fired');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install prompt after a delay
  setTimeout(() => {
    if (!localStorage.getItem('pwa-install-dismissed')) {
      installPrompt.style.display = 'block';
    }
  }, 10000); // Show after 10 seconds
});

// Install button click
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log('User choice:', result);
      
      if (result.outcome === 'accepted') {
        showNotification('ExpenseFlow installed successfully!', 'success');
      }
      
      deferredPrompt = null;
      installPrompt.style.display = 'none';
    }
  });
}

// Dismiss install prompt
if (installDismiss) {
  installDismiss.addEventListener('click', () => {
    installPrompt.style.display = 'none';
    localStorage.setItem('pwa-install-dismissed', 'true');
  });
}

// Online/Offline Status
window.addEventListener('online', () => {
  offlineIndicator.style.display = 'none';
  showNotification('Back online! 🌍', 'success');
});

window.addEventListener('offline', () => {
  offlineIndicator.style.display = 'flex';
  showNotification('You are offline. Changes will be saved locally.', 'warning');
});

// Update notification
function showUpdateNotification() {
  updateNotification.style.display = 'block';
}

// Update button click
if (updateButton) {
  updateButton.addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  });
}

// Initialize the app
Init();

// Event Listeners
form.addEventListener('submit', addTransaction);

// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
  // Add loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
  }, 100);
});
