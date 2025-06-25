let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUser = null;

function register() {
  const upi = document.getElementById("upi").value.trim();
  if (!upi) return alert("Please enter a UPI ID");

  if (!users[upi]) {
    users[upi] = {
      balance: 1000,
      transactions: []
    };
    localStorage.setItem("users", JSON.stringify(users));
  }

  currentUser = upi;
  document.getElementById("user-upi").innerText = currentUser;
  document.getElementById("balance").innerText = users[currentUser].balance;
  document.getElementById("user-section").style.display = "block";
  loadTransactions();
}

function sendMoney() {
  const toUPI = document.getElementById("to-upi").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (!toUPI || isNaN(amount) || amount <= 0) {
    alert("Invalid UPI or amount");
    return;
  }

  if (!users[toUPI]) {
    alert("Receiver UPI ID not registered");
    return;
  }

  if (users[currentUser].balance < amount) {
    alert("Insufficient balance");
    return;
  }

  users[currentUser].balance -= amount;
  users[toUPI].balance += amount;

  const now = new Date().toLocaleString();

  users[currentUser].transactions.push({
    to: toUPI,
    amount: -amount,
    time: now
  });

  users[toUPI].transactions.push({
    from: currentUser,
    amount: amount,
    time: now
  });

  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("balance").innerText = users[currentUser].balance;
  loadTransactions();
  alert("Money sent successfully");
}

function loadTransactions() {
  const list = document.getElementById("transactions");
  list.innerHTML = "";
  const txs = users[currentUser].transactions.slice().reverse();

  for (let tx of txs) {
    const li = document.createElement("li");
    if (tx.to) {
      li.textContent = `➡️ Sent ₹${-tx.amount} to ${tx.to} on ${tx.time}`;
    } else {
      li.textContent = `⬅️ Received ₹${tx.amount} from ${tx.from} on ${tx.time}`;
    }
    list.appendChild(li);
  }
}
