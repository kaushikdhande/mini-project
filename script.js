const users = {
    "seller1": "1234",
    "seller2": "5678",
    "seller3":"0987",
    "admin": "admin123"
  };

  let currentUser = null;
  let sellerData = {
    seller1: [],
    seller2: [],
    seller3: []
  };

  function login() {
    const uname = document.getElementById("username").value.trim();
    const pwd = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    if (users[uname] && users[uname] === pwd) {
      currentUser = uname;
      error.textContent = "";
      document.getElementById("loginSection").classList.add("hidden");
      document.getElementById("dashboardSection").classList.remove("hidden");
      document.getElementById("sellerTitle").textContent = `Welcome, ${uname}`;

      if (uname === "admin") {
        document.getElementById("adminControls").classList.remove("hidden");
        document.getElementById("sellerControls").classList.add("hidden");
        populateSellerSelector();
        renderAdminTables();
      } else {
        document.getElementById("adminControls").classList.add("hidden");
        document.getElementById("sellerControls").classList.remove("hidden");
        if (!sellerData[uname]) sellerData[uname] = [];
        renderMonthlyTable();
        renderDayTable();
      }
    } else {
      error.textContent = "Invalid credentials!";
    }
  }

  function logout() {
    currentUser = null;
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  }

  function addEntry() {
    const date = document.getElementById("entryDate").value;
    const revenue = parseFloat(document.getElementById("entryRevenue").value);
    const expenses = parseFloat(document.getElementById("entryExpenses").value);
    if (!date || isNaN(revenue) || isNaN(expenses)) {
      alert("Please fill all fields.");
      return;
    }
    const profit = revenue - expenses;
    sellerData[currentUser].push({ date, revenue, expenses, profit });
    renderMonthlyTable();
    renderDayTable();
    document.getElementById("entryDate").value = "";
    document.getElementById("entryRevenue").value = "";
    document.getElementById("entryExpenses").value = "";
  }

  function renderMonthlyTable(selected = currentUser) {
    const data = sellerData[selected] || [];
    const monthly = {};
    data.forEach(entry => {
      const month = new Date(entry.date).getMonth();
      if (!monthly[month]) monthly[month] = { revenue: 0, expenses: 0, profit: 0 };
      monthly[month].revenue += entry.revenue;
      monthly[month].expenses += entry.expenses;
      monthly[month].profit += entry.profit;
    });

    const tbody = document.querySelector("#monthlyTable tbody");
    tbody.innerHTML = "";
    for (let m in monthly) {
      const row = `<tr>
        <td>${new Date(2023, m, 1).toLocaleString('default', { month: 'short' })}</td>
        <td>${monthly[m].revenue}</td>
        <td>${monthly[m].expenses}</td>
        <td>${monthly[m].profit}</td>
      </tr>`;
      tbody.innerHTML += row;
    }
  }

  function renderDayTable(selected = currentUser) {
    const selectedMonth = parseInt(document.getElementById("monthSelector").value);
    const data = sellerData[selected]?.filter(entry => new Date(entry.date).getMonth() === selectedMonth) || [];
    const tbody = document.querySelector("#dayTable tbody");
    tbody.innerHTML = "";
    data.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(entry => {
      const row = `<tr>
        <td>${new Date(entry.date).toLocaleDateString()}</td>
        <td>${entry.revenue}</td>
        <td>${entry.expenses}</td>
        <td>${entry.profit}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  }

  function populateSellerSelector() {
    const selector = document.getElementById("sellerSelector");
    selector.innerHTML = "";
    for (let seller in sellerData) {
      const option = document.createElement("option");
      option.value = seller;
      option.textContent = seller;
      selector.appendChild(option);
    }
  }

  function renderAdminTables() {
    const selectedSeller = document.getElementById("sellerSelector").value;
    renderMonthlyTable(selectedSeller);
    renderDayTable(selectedSeller);
  }