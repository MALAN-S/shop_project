import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', description: '', purchasePrice: '', sellingPrice: '', currentStock: 0, minStockLevel: 0, status: 'ACTIVE', categoryId: '' });

  const load = () => {
    const params = {};
    if (search) params.search = search;
    if (catFilter) params.categoryId = catFilter;
    api.get('/products', { params }).then(r => setProducts(r.data));
    api.get('/categories').then(r => setCategories(r.data));
  };
  useEffect(load, [search, catFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, purchasePrice: Number(form.purchasePrice), sellingPrice: Number(form.sellingPrice), currentStock: Number(form.currentStock), minStockLevel: Number(form.minStockLevel), categoryId: form.categoryId ? Number(form.categoryId) : null };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false); setEditingId(null);
      setForm({ name: '', sku: '', description: '', purchasePrice: '', sellingPrice: '', currentStock: 0, minStockLevel: 0, status: 'ACTIVE', categoryId: '' });
      load();
    } catch (err) { alert(err.response?.data?.error || 'Failed to save product'); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, sku: p.sku, description: p.description || '', purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice, currentStock: p.currentStock, minStockLevel: p.minStockLevel, status: p.status, categoryId: p.categoryId || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📦 Product Management</h1>
          <p className="text-sm text-gray-500">Manage stationery items, SKU codes, pricing, and stock</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', sku: '', description: '', purchasePrice: '', sellingPrice: '', currentStock: 0, minStockLevel: 0, status: 'ACTIVE', categoryId: '' }); }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <input required placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input required placeholder="SKU Code" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input required type="number" step="0.01" placeholder="Purchase Price" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input required type="number" step="0.01" placeholder="Selling Price" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Current Stock" value={form.currentStock} onChange={e => setForm({ ...form, currentStock: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Min Stock Level" value={form.minStockLevel} onChange={e => setForm({ ...form, minStockLevel: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700">{editingId ? 'Update' : 'Save'}</button>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-lg px-3 py-2 text-sm flex-1" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full sm:w-48">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="py-3 px-4">Product</th><th className="py-3 px-4">SKU</th><th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Buy ₹</th><th className="py-3 px-4">Sell ₹</th><th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th><th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-800">{p.name}</td>
                <td className="py-3 px-4 text-gray-500 font-mono text-xs">{p.sku}</td>
                <td className="py-3 px-4 text-gray-500">{p.categoryName || '-'}</td>
                <td className="py-3 px-4">₹{Number(p.purchasePrice).toFixed(2)}</td>
                <td className="py-3 px-4 font-bold">₹{Number(p.sellingPrice).toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`font-bold ${p.lowStock ? 'text-rose-600' : 'text-gray-800'}`}>{p.currentStock}</span>
                  {p.lowStock && <span className="ml-1 text-[10px] text-rose-500 uppercase font-bold">Low</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>{p.status}</span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:underline text-xs font-semibold">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:underline text-xs font-semibold">Deactivate</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="8" className="py-8 text-center text-gray-400">No products found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
