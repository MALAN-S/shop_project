import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EXPENSE_CATEGORIES = ['Paper Purchase', 'Ink and Toner', 'Electricity', 'Rent', 'Machine Maintenance', 'Other'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Paper Purchase', amount: '', expenseDate: new Date().toISOString().split('T')[0], description: '', paymentMethod: 'CASH' });

  const load = () => { api.get('/expenses').then(r => setExpenses(r.data)); };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/expenses', { ...form, amount: Number(form.amount) });
    setForm({ category: 'Paper Purchase', amount: '', expenseDate: new Date().toISOString().split('T')[0], description: '', paymentMethod: 'CASH' });
    setShowForm(false); load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`); load();
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">💸 Expense Management</h1><p className="text-sm text-gray-500">Track shop expenses — paper, ink, rent, maintenance</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">{showForm ? 'Cancel' : '+ Add Expense'}</button>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="text-xs text-gray-400 font-semibold">Total Recorded Expenses</div>
        <div className="text-2xl font-bold text-rose-600">₹{totalExpenses.toFixed(2)}</div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input required type="number" step="0.01" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input type="date" value={form.expenseDate} onChange={e => setForm({ ...form, expenseDate: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Description / Note" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="CASH">Cash</option><option value="UPI">UPI</option><option value="CARD">Card</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700">Save Expense</button>
        </form>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr><th className="py-3 px-4">Category</th><th className="py-3 px-4">Amount</th><th className="py-3 px-4">Date</th><th className="py-3 px-4">Description</th><th className="py-3 px-4">Payment</th><th className="py-3 px-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">{exp.category}</td>
                <td className="py-3 px-4 font-bold text-rose-600">₹{Number(exp.amount).toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-500">{exp.expenseDate}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{exp.description || '-'}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100">{exp.paymentMethod}</span></td>
                <td className="py-3 px-4"><button onClick={() => handleDelete(exp.id)} className="text-rose-500 hover:underline text-xs font-semibold">Delete</button></td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400">No expenses recorded</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
