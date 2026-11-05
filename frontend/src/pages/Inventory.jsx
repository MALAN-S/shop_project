import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: '', type: 'IN', quantity: '', reference: '' });

  const load = () => {
    api.get('/products').then(r => setProducts(r.data));
    api.get('/inventory/low-stock').then(r => setLowStock(r.data));
  };
  useEffect(load, []);

  const loadTransactions = (productId) => {
    setSelectedProduct(productId);
    api.get(`/inventory/transactions/${productId}`).then(r => setTransactions(r.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = form.type === 'IN' ? '/inventory/stock-in' : form.type === 'OUT' ? '/inventory/stock-out' : '/inventory/adjust';
    try {
      await api.post(endpoint, { productId: form.productId, type: form.type, quantity: Number(form.quantity), reference: form.reference });
      setShowForm(false); setForm({ productId: '', type: 'IN', quantity: '', reference: '' }); load();
      if (selectedProduct) loadTransactions(selectedProduct);
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">📊 Inventory Management</h1><p className="text-sm text-gray-500">Stock-in, stock-out, adjustments, and low-stock alerts</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">{showForm ? 'Cancel' : '+ Stock Entry'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3">
          <select required value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Select Product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock})</option>)}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="IN">Stock In</option><option value="OUT">Stock Out</option><option value="ADJUST">Adjust To</option>
          </select>
          <input required type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Reference / Note" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700">Submit</button>
        </form>
      )}

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-800 mb-2">⚠️ Low Stock Products ({lowStock.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {lowStock.map(p => (
              <div key={p.id} className="bg-white rounded-lg p-3 border border-amber-100 flex justify-between">
                <div><div className="font-semibold text-sm">{p.name}</div><div className="text-xs text-gray-500">Min: {p.minStockLevel}</div></div>
                <div className="text-rose-600 font-bold">{p.currentStock}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Stock Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr><th className="py-3 px-4">Product</th><th className="py-3 px-4">SKU</th><th className="py-3 px-4">Stock</th><th className="py-3 px-4">Min Level</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">History</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">{p.name}</td>
                <td className="py-3 px-4 font-mono text-xs text-gray-500">{p.sku}</td>
                <td className="py-3 px-4"><span className={`font-bold ${p.lowStock ? 'text-rose-600' : 'text-emerald-600'}`}>{p.currentStock}</span></td>
                <td className="py-3 px-4 text-gray-500">{p.minStockLevel}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${p.lowStock ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>{p.lowStock ? 'Low' : 'OK'}</span></td>
                <td className="py-3 px-4"><button onClick={() => loadTransactions(p.id)} className="text-indigo-600 hover:underline text-xs font-semibold">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction History */}
      {selectedProduct && (
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-3">Stock Transaction History</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr><th className="py-2 px-3">Type</th><th className="py-2 px-3">Qty</th><th className="py-2 px-3">Reference</th><th className="py-2 px-3">Date</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.type === 'IN' ? 'bg-emerald-100 text-emerald-800' : t.type === 'OUT' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'}`}>{t.type}</span></td>
                  <td className="py-2 px-3 font-bold">{t.quantity}</td>
                  <td className="py-2 px-3 text-gray-500 text-xs">{t.reference}</td>
                  <td className="py-2 px-3 text-xs text-gray-400">{t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : '-'}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan="4" className="py-4 text-center text-gray-400">No transactions</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
