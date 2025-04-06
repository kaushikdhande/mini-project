document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const userId = document.getElementById("userid").value;
      const password = document.getElementById("password").value;

      if (userId === "admin" && password === "1234") {
        window.location.href = "clients.html";
      } else {
        alert("Invalid credentials");
      }
    });
  }

  // Seller Page Logic
  const sellerId = document.body.dataset.seller;

  if (sellerId && sellerData[sellerId]) {
    const data = sellerData[sellerId];

    // Header
    document.getElementById("seller-name").innerText = data.name;

    // Monthly Table
    const monthTable = document.getElementById("finance-monthly");
    data.monthly.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${row.month}</td>
                      <td>${row.revenue}</td>
                      <td>${row.expenses}</td>
                      <td>${row.profit}</td>`;
      monthTable.appendChild(tr);
    });

    // Daily Dropdown
    const dropdown = document.getElementById("month-select");
    Object.keys(data.daily).forEach(month => {
      const opt = document.createElement("option");
      opt.value = month;
      opt.text = month;
      dropdown.appendChild(opt);
    });

    // On Change Load Daily Table
    const dailyTable = document.getElementById("finance-daily");
    dropdown.addEventListener("change", () => {
      const selected = dropdown.value;
      dailyTable.innerHTML = "";
      data.daily[selected].forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.date}</td>
                        <td>${row.revenue}</td>
                        <td>${row.expenses}</td>
                        <td>${row.profit}</td>`;
        dailyTable.appendChild(tr);
      });
    });

    dropdown.dispatchEvent(new Event("change")); // Load default
  }
});
