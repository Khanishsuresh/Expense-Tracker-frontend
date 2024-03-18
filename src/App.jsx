
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  async function fetchExpenses() {
    const response = await fetch('http://localhost:4000/api/expenses');
    if(!response.ok){
      throw new Error('Failed to fetch expenses');
    }
    else{
      const data = await response.json();
      console.log(data)
      setExpenses(data);
    }
  }

  useEffect(() => {
    fetchExpenses();
  },[]);

  const addExpense = async(e) => {
    // if (!description || !amount) return;
  
    // const parsedAmount = parseFloat(amount);
    // const existingExpenseIndex = expenses.findIndex((expense) => expense.description === description);
  
    // if (existingExpenseIndex !== -1) {
    //   const updatedExpenses = [...expenses];
    //   updatedExpenses[existingExpenseIndex].amount += parsedAmount;
    //   setExpenses(updatedExpenses);
    // } else {
    //   const newExpense = { description, amount: parsedAmount };
    //   setExpenses([...expenses, newExpense]);
    // }
  
    // setDescription('');
    // setAmount('');
    const response = await fetch('http://localhost:4000/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, amount })
    });
    if (!response.ok) {
      console.error('Failed to add expense');
    }
    else{
      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
    }
  };
  
  const deleteExpense = async(index) => { 
    await fetch(`http://localhost:4000/api/expenses/${expenses[index]._id}`, { method: 'DELETE' });
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses); 
  };

  const editExpense = async(index) => {
    const newExpenses = [...expenses];
    const expense = newExpenses[index];
    setDescription(expense.description);
    setAmount(expense.amount);
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
  };

  const totalIncome = expenses
    .filter((item) => item.amount > 0)
    .reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenses
    .filter((item) => item.amount < 0)
    .reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome + totalExpense;


  return (
    <>
    <h1 className='heading'>Expense Tracker</h1>

    <div className="App">
      <div className="income-expense-container">
        <div className="income">
          <div className="title">Income</div>
          <div className="balance">${totalIncome.toFixed(2)}</div>
        </div>
        <div className="block"></div>
        <div className="expense">
          <div className="title">Expense</div>
          <div className="balance">${totalExpense.toFixed(2)}</div>
        </div>
        <div className="block"></div>
        <div className='total-remaining'>
          <div className="title">Total Balance</div>
          <div className="balance">${balance.toFixed(2)}</div>
        </div>
      </div>

      <form>
        <div className="input-container">
          <input
            type="text"
            placeholder="Expense Name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Expense Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="button" onClick={addExpense}>Add Expense</button>
      </form>

      <div className="expense-item-container">
        {expenses.map((expense, index) => (
          <div
            key={index}
            className={`expense-item ${expense.amount < 0 ? 'negative' : 'positive'}`}
          >
            <div>{expense.description}</div>
            <div>${expense.amount.toFixed(2)}</div>
            <div
              className="delete-btn"
              onClick={() => deleteExpense(index)}
            >
              Delete
            </div>
            <div
              className="edit-btn"
              onClick={() => editExpense(index)}
            >
              Edit
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default App;
