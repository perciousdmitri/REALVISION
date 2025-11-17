function validateLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (!email.value.trim() || !password.value.trim()) {
        alert("Please fill in all fields before logging in.");
        return false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email.value)) {
        alert("Please enter a valid email address.");
        email.focus();
        return false;
    }

    alert("Login successful! Redirecting to Dashboard...");
    window.location.href = "index.html";
    return true;
}

function validateSignup(event) {
    event.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
        alert("All fields are required to create an account.");
        return false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailPattern.test(email.value)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (password.value.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    alert("Account created successfully! Redirecting to login...");
    window.location.href = "login.html";
    return true;
}

let materials = [];
const materialPrices = {
    Cement: 85,
    Steel: 4200,
    Blocks: 3.5,
    Sand: 250,
    Paint: 300,
};

function addMaterial(event) {
    event.preventDefault();
    const materialSelect = document.getElementById("material");
    const quantityInput = document.getElementById("quantity");

    const material = materialSelect.value;
    const quantity = parseFloat(quantityInput.value);

    if (!material || isNaN(quantity) || quantity <= 0) {
        alert("Please select a material and enter a valid quantity.");
        return;
    }

    const cost = materialPrices[material] * quantity;
    materials.push({ material, quantity, cost });

    updateMaterialTable();
    updateTotalValue();
    quantityInput.value = "";
}

function updateMaterialTable() {
    const tableBody = document.getElementById("materialTableBody");
    tableBody.innerHTML = "";
    materials.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.material}</td>
      <td>${item.quantity}</td>
      <td>${materialPrices[item.material]}</td>
      <td>${item.cost.toFixed(2)}</td>
    `;
        tableBody.appendChild(row);
    });
}

function updateTotalValue() {
    const total = materials.reduce((sum, item) => sum + item.cost, 0);
    document.getElementById("totalValue").textContent = `GHS ${total.toLocaleString()}`;
}

function assessDemand() {
    if (materials.length === 0) {
        alert("Add materials first before assessing demand.");
        return;
    }

    const total = materials.reduce((sum, item) => sum + item.cost, 0);
    const demandScore = Math.max(10, 100 - total / 2500 + Math.random() * 10).toFixed(1);

    const insightBox = document.getElementById("insightResult");
    insightBox.innerHTML = `
    <strong>Demand Score:</strong> ${demandScore}%<br>
    <em>${demandScore > 70 ? "High Demand" : demandScore > 40 ? "Moderate Demand" : "Low Demand"}</em>
  `;

    saveRecentAnalysis(total, demandScore);
}

function saveRecentAnalysis(total, score) {
    const list = document.getElementById("recentList");
    if (!list) return;

    const entry = document.createElement("li");
    const date = new Date().toLocaleDateString("en-GB");
    entry.textContent = `Value: GHS ${total.toLocaleString()} | Score: ${score}% | Date: ${date}`;
    list.appendChild(entry);

    let history = JSON.parse(localStorage.getItem("recentAnalyses") || "[]");
    history.push({ total, score, date });
    localStorage.setItem("recentAnalyses", JSON.stringify(history));
}

function loadRecentAnalyses() {
    const history = JSON.parse(localStorage.getItem("recentAnalyses") || "[]");
    const tbody = document.getElementById("recentTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (history.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3' style='text-align:center;'>No analyses found.</td></tr>";
        return;
    }

    history.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${entry.date}</td>
      <td>GHS ${entry.total.toLocaleString()}</td>
      <td>${entry.score}%</td>
    `;
        tbody.appendChild(row);
    });
}