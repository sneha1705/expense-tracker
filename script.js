// DOM Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let prevBalance = 0; // For balance animation

// Add transaction to DOM
function addTransactionDOM(transaction){
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id}, this)">x</button>
  `;
  list.appendChild(item);
}

// Animate balance
function animateBalance(start, end){
  let current = parseFloat(start);
  const target = parseFloat(end);
  const steps = 20;
  const stepTime = 20;
  const step = (target - current)/steps;

  const interval = setInterval(() => {
    current += step;
    balance.innerText = `$${current.toFixed(2)}`;
    if((step > 0 && current >= target) || (step < 0 && current <= target)){
      balance.innerText = `$${target}`;
      clearInterval(interval);
    }
  }, stepTime);
}

// Update totals
function updateValues(){
  const amounts = transactions.map(t => Number(t.amount));
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc,a)=> acc + a, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((acc,a)=> acc + a, 0) * -1).toFixed(2);

  animateBalance(prevBalance, total);
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;

  prevBalance = total;
}

// Remove transaction
function removeTransaction(id, element){
  element.parentElement.classList.add('remove');
  setTimeout(()=>{
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
  }, 300);
}

// Add new transaction
function addTransaction(e){
  e.preventDefault();
  if(text.value.trim() === '' || amount.value.trim() === '') return;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: parseFloat(amount.value) // Ensure it's a number
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = '';
  amount.value = '';
}

// LocalStorage
function updateLocalStorage(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init(){
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listener
form.addEventListener('submit', addTransaction);
init();

// Dark mode toggle
function toggleMode(){
  document.body.classList.toggle('dark');
  document.querySelector('.container').classList.toggle('dark');
}