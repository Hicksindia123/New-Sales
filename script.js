/* --------- BACKEND API URL --------- */
const API = "https://script.google.com/macros/s/AKfycbxJlUCJqXzHOHXUZBGyzvih2LAN0ePc1gCnOhVe6KCzD7WhnpSPDdEsZRntVtIBwE4JCA/exec";

/* --------- NAVIGATION --------- */
function showPage(id){
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

/* --------- LOAD ORDERS ON PAGE LOAD --------- */
document.addEventListener("DOMContentLoaded", loadOrders);

function loadOrders(){
  fetch(API + "?action=getOrders")
    .then(r => r.json())
    .then(renderOrders)
    .catch(err => console.log(err));
}

function renderOrders(res) {
  const box = document.getElementById("ordersContainer");
  box.innerHTML = "";

  if (!res.data || res.data.length === 0) {
    box.innerHTML = "<p>No orders found.</p>";
    return;
  }

  res.data.forEach(row => {
    let orderId = row[0];        // Column A
    let distributor = row[6];    // Column G
    let orderReceived = row[8];  // Column I

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>Order #${orderId}</h3>
      <p><b>Distributor:</b> ${distributor}</p>
      <p><b>Order Received:</b> ${orderReceived}</p>

      <button class="btn btn-primary" onclick="openProcess('${orderId}')">
        Process
      </button>
    `;

    box.appendChild(card);
  });
}


/* -------- OPEN PROCESS PAGE -------- */
function openProcess(orderId){
  showPage("processPage");

  document.getElementById("processContainer").innerHTML = `
    <div class="card">
      <h3>Processing Order #${orderId}</h3>

      <label>Order Received?</label>
      <select id="orderReceivedSelect" onchange="toggleOrderReceived()">
        <option>No</option>
        <option>Yes</option>
      </select>

      <div id="visitSection" class="section hidden">
        <h4>Visit Image Check</h4>
        <button class="btn btn-success">Mark Done</button>
      </div>

      <div id="piSection" class="section hidden">
        <h4>PI Section</h4>
        <select><option>No</option><option>Yes</option></select>
      </div>

      <div id="advanceSection" class="section hidden">
        <h4>Advance</h4>
        <input type="number" placeholder="Amount">
      </div>

      <div id="readySection" class="section hidden">
        <h4>Ready to Process?</h4>
        <select id="readySelect" onchange="toggleReady()">
          <option>No</option>
          <option>Partially</option>
          <option>Yes</option>
        </select>
      </div>

      <div id="partialSection" class="section hidden"></div>

      <div id="mainProcess" class="section hidden">
        <button class="btn btn-primary">Challan</button>
        <button class="btn btn-primary">CTN Weight</button>
        <button class="btn btn-primary">Invoice</button>
        <button class="btn btn-primary">Gate Pass</button>
      </div>
    </div>
  `;
}

/* ---------- Order Received Logic ---------- */
function toggleOrderReceived(){
  let v = document.getElementById("orderReceivedSelect").value;

  document.getElementById("visitSection").classList.toggle("hidden", v !== "No");
  document.getElementById("piSection").classList.toggle("hidden", v !== "Yes");
  document.getElementById("advanceSection").classList.toggle("hidden", v !== "Yes");
  document.getElementById("readySection").classList.toggle("hidden", v !== "Yes");
}

/* ---------- Ready to Process Logic ---------- */
function toggleReady(){
  let v = document.getElementById("readySelect").value;

  let partialDiv = document.getElementById("partialSection");
  let mainDiv = document.getElementById("mainProcess");

  if(v === "Yes"){
    partialDiv.classList.add("hidden");
    mainDiv.classList.remove("hidden");
  }
  if(v === "No"){
    partialDiv.classList.remove("hidden");
    partialDiv.innerHTML = `
      <h4>Pending Reason</h4>
      <select><option>Stock</option><option>Payment</option></select>
      <button class="btn btn-warning">Save Pending</button>
    `;
    mainDiv.classList.add("hidden");
  }
  if(v === "Partially"){
    partialDiv.classList.remove("hidden");
    partialDiv.innerHTML = `
      <h4>Partial Order Processing</h4>
      <label>Reason</label>
      <select><option>Stock</option><option>Payment</option></select>
      <input type="number" placeholder="Qty">
      <button class="btn btn-success">Save Partial</button>
    `;
    mainDiv.classList.remove("hidden");
  }
}
