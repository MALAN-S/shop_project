import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'STAFF' });

  const load = () => { api.get('/users').then(r => setUsers(r.data)); };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      setForm({ username: '', password: '', role: 'STAFF' }); setShowForm(false); load();
    } catch (err) { alert(err.response?.data?.error || 'Failed to create user'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">👥 User Management</h1><p className="text-sm text-gray-500">Manage admin and staff accounts</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">{showForm ? 'Cancel' : '+ Add User'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
          <input required placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="STAFF">Staff</option><option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg py-2 font-semibold hover:bg-indigo-700">Create User</button>
        </form>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr><th className="py-3 px-4">Username</th><th className="py-3 px-4">Role</th><th className="py-3 px-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-800">{u.username}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                </td>
                <td className="py-3 px-4"><button onClick={() => handleDelete(u.id)} className="text-rose-500 hover:underline text-xs font-semibold">Delete</button></td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="3" className="py-8 text-center text-gray-400">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
