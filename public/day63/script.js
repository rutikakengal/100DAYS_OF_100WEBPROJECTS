 const nameInput = document.getElementById("name");
    const amountInput = document.getElementById("amount");
    const categoryInput = document.getElementById("category");
    const percentageInput = document.getElementById("percentage");
    const addBtn = document.getElementById("add-btn");
    const expenseList = document.getElementById("expense-list");
    const calculateBtn = document.getElementById("calculate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const exportBtn = document.getElementById("export-btn");
    const output = document.getElementById("output");
    const toast = document.getElementById("toast");
    const chartCanvas = document.getElementById("summaryChart");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const searchInput = document.getElementById("search");
    const splitModeSelect = document.getElementById("splitMode");

    let expenses = [];
    let editingIndex = null;

    function showToast(msg, type = "info") {
      toast.textContent = msg;
      toast.style.background =
        type === "success" ? "#51cf66" : type === "error" ? "#ff6b6b" : "#6c63ff";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }

    // Load saved data
    window.addEventListener("load", () => {
      const stored = JSON.parse(localStorage.getItem("expenses"));
      if (stored) {
        expenses = stored;
        expenses.forEach(createListItem);
      }

      const lastCalc = JSON.parse(localStorage.getItem("lastCalculation"));
      if (lastCalc) {
        output.innerHTML = lastCalc.outputHTML;
        renderChart();
      }

      if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
        darkModeToggle.checked = true;
      }
    });

    darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark") ? "enabled" : "disabled"
      );
    });

    // Create Expense Item (with Edit + Date)
    function createListItem(exp, index) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="expense-info">
          <span><strong>${exp.name}</strong>: ₹${exp.amount.toFixed(2)} (${exp.category})
            ${exp.percentage ? "[" + exp.percentage + "%]" : ""}
          </span>
          <span class="date">📅 ${exp.date}</span>
        </div>
        <div class="buttons">
          <button class="edit">✏️</button>
          <button class="delete">🗑️</button>
        </div>
      `;
      expenseList.appendChild(li);

      // Edit expense
      li.querySelector(".edit").addEventListener("click", () => {
        nameInput.value = exp.name;
        amountInput.value = exp.amount;
        categoryInput.value = exp.category;
        percentageInput.value = exp.percentage || "";
        editingIndex = index;
        addBtn.textContent = "Update Expense";
      });

      // Delete expense
      li.querySelector(".delete").addEventListener("click", () => {
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        refreshList();
        showToast("Expense deleted", "success");
      });
    }

    // Refresh List
    function refreshList() {
      expenseList.innerHTML = "";
      expenses.forEach((exp, i) => createListItem(exp, i));
    }

    // Add or Update Expense
    addBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const category = categoryInput.value;
      const perc = parseFloat(percentageInput.value);

      if (!name || isNaN(amount) || amount <= 0)
        return showToast("Enter valid name and amount", "error");

      const exp = {
        name,
        amount,
        category,
        percentage: !isNaN(perc) ? perc : null,
        date: new Date().toLocaleString(),
      };

      if (editingIndex !== null) {
        expenses[editingIndex] = exp;
        showToast("Expense updated", "success");
        editingIndex = null;
        addBtn.textContent = "Add Expense";
      } else {
        if (expenses.some((e) => e.name.toLowerCase() === name.toLowerCase()))
          return showToast("Name already exists", "error");

        expenses.push(exp);
        showToast("Expense added", "success");
      }

      localStorage.setItem("expenses", JSON.stringify(expenses));
      refreshList();

      nameInput.value = "";
      amountInput.value = "";
      percentageInput.value = "";
    });

    // Chart Rendering
    function renderChart() {
      if (expenses.length === 0) return;
      if (window.expChart) window.expChart.destroy();

      window.expChart = new Chart(chartCanvas, {
        type: "pie",
        data: {
          labels: expenses.map((e) => e.name),
          datasets: [
            {
              data: expenses.map((e) => e.amount),
              backgroundColor: expenses.map(
                () => `hsl(${Math.random() * 360}, 70%, 60%)`
              ),
            },
          ],
        },
        options: { plugins: { legend: { position: "bottom" } } },
      });
    }

    // Calculate Split
    calculateBtn.addEventListener("click", () => {
      if (expenses.length < 2)
        return (output.textContent = "Add at least 2 people to calculate.");

      const total = expenses.reduce((s, e) => s + e.amount, 0);
      const totalPerc = expenses.reduce((s, e) => s + (e.percentage || 0), 0);
      const mode = splitModeSelect.value;

      let result = `<p><strong>Total:</strong> ₹${total.toFixed(2)}</p><hr>`;

      expenses.forEach((e) => {
        let share;
        if (mode === "equal") share = total / expenses.length;
        else if (mode === "percentage" && totalPerc > 0)
          share = total * (e.percentage / totalPerc);
        else if (mode === "amount") share = (e.amount / total) * total;

        const bal = (e.amount - share).toFixed(2);
        result +=
          bal > 0
            ? `<p>✅ ${e.name} should receive ₹${bal}</p>`
            : bal < 0
            ? `<p>❌ ${e.name} owes ₹${Math.abs(bal)}</p>`
            : `<p>⚖️ ${e.name} is settled!</p>`;
      });

      output.innerHTML = result;
      renderChart();
      localStorage.setItem("lastCalculation", JSON.stringify({ outputHTML: result }));

      const copyBtn = document.createElement("button");
      copyBtn.textContent = "Copy Summary 📋";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(output.innerText);
        showToast("Summary copied!", "success");
      };
      output.appendChild(copyBtn);
      showToast("Split Calculated", "success");
    });

    resetBtn.addEventListener("click", () => {
      expenses = [];
      localStorage.clear();
      expenseList.innerHTML = "";
      output.innerHTML = "";
      if (window.expChart) window.expChart.destroy();
      showToast("All cleared", "success");
    });

    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const items = expenseList.querySelectorAll("li");
      items.forEach((li) => {
        li.style.display = li.textContent.toLowerCase().includes(term)
          ? "flex"
          : "none";
      });
    });

    exportBtn.addEventListener("click", () => {
      if (expenses.length === 0) return showToast("No data to export", "error");

      const rows = [
        ["Name", "Amount", "Category", "Percentage", "Date"],
        ...expenses.map((e) => [
          e.name,
          e.amount,
          e.category,
          e.percentage || "",
          e.date,
        ]),
      ];

      const csvContent = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "expenses.csv";
      a.click();
      showToast("Exported CSV", "success");
    });

    document.getElementById("pdf-btn").addEventListener("click", () => {
      const w = window.open("", "_blank");
      w.document.write("<h2>Expense Summary</h2>" + output.innerHTML);
      w.print();
    });