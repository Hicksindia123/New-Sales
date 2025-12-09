// 🔗 Replace this with YOUR Apps Script deployment URL
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxxxx/exec";

document.addEventListener("DOMContentLoaded", loadOrders);

function showPage(p) {
  document.querySelectorAll(".page").forEach(x => x.style.display="none");
  document.getElementById(p).style.display="block";
}

/* ---------- LOAD ORDERS FROM BACKEND ---------- */
function loadOrders() {
  fetch(WEB_APP_URL + "?action=getOrders")
    .then(res => res.json())
    .then(data => renderOrders(data));
}

function renderOrders(res) {
  const container = document.getElementById("ordersContainer");
  container.innerHTML = "";

  if (!res.data || res.data.length === 0) {
    container.innerHTML = "<p>No orders found.</p>";
    return;
  }

  res.data.forEach((row, i) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>Order #${row[0]}</h3>
      <p><b>Distributor:</b> ${row[6]}</p>
      <p><b>Order Received?:</b> ${row[8]}</p>

      <button class="btn btn-primary" onclick="openProcess(${i+2}, '${row[0]}')">Process</button>
    `;

    container.appendChild(card);
  });
}

/* ---------- PROCESS SCREEN ---------- */
let selectedRow = null;
let selectedOrderId = null;

function openProcess(row, id) {
  selectedRow = row;
  selectedOrderId = id;
  showPage("processPage");

  document.getElementById("processContainer").innerHTML = `
    <div class="card">
      <h3>Processing Order #${id}</h3>

      <label>Order Received?</label>
      <select id="orderReceived" onchange="orderReceivedChanged()">
        <option>No</option>
        <option>Yes</option>
      </select>

      <div id="visitImageSection" class="section hidden">
        <h4>Visit Image Check</h4>
        <button class="btn btn-success">Mark Done</button>
      </div>

      <div id="piSection" class="section hidden">
        <h4>PI Section</h4>
        <label>PI Sent?</label>
        <select>
          <option>No</option><option>Yes</option>
        </select>
      </div>

      <div id="advanceSection" class="section hidden">
        <h4>Advance Payment</h4>
        <input type="number" placeholder="Advance Amount">
        <label>Received?</label>
        <select><option>No</option><option>Yes</option></select>
      </div>

      <div id="readySection" class="section hidden">
        <h4>Ready to Process?</h4>
        <select onchange="readyChanged()" id="readySelect">
          <option>No</option>
          <option>Partially</option>
          <option>Yes</option>
        </select>
      </div>

      <div id="partialSection" class="section hidden"></div>
      <div id="mainProcess" class="section hidden">
        <h4>Main Processing</h4>
        <button class="btn btn-primary">Challan</button>
        <button class="btn btn-primary">CTN Weight</button>
        <button class="btn btn-primary">Invoice</button>
        <button class="btn btn-primary">Gate Pass</button>
      </div>
    </div>
  `;
}
