import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [rates, setRates] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [svcForm, setSvcForm] = useState({ name: '', description: '', status: 'ACTIVE' });
  const [rateForm, setRateForm] = useState({ serviceId: '', paperSize: 'A4', sides: 'SINGLE', pricePerPage: '', active: true });

  const load = () => {
    api.get('/services').then(r => setServices(r.data));
    api.get('/service-rates').then(r => setRates(r.data));
  };
  useEffect(load, []);

  const handleCreateService = async (e) => {
    e.preventDefault();
    await api.post('/services', svcForm);
    setSvcForm({ name: '', description: '', status: 'ACTIVE' }); setShowServiceForm(false); load();
  };

  const handleCreateRate = async (e) => {
    e.preventDefault();
    await api.post('/service-rates', { ...rateForm, pricePerPage: Number(rateForm.pricePerPage) });
    setRateForm({ serviceId: '', paperSize: 'A4', sides: 'SINGLE', pricePerPage: '', active: true }); setShowRateForm(false); load();
  };

  const handleDeleteRate = async (id) => {
    if (!window.confirm('Delete this rate?')) return;
    await api.delete(`/service-rates/${id}`); load();
  };

  return (
    <div className="space-y-6">
      {/* Services Section */}
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">🖨️ Services & Rates</h1><p className="text-sm text-gray-500">Configure Xerox, printing, and other service pricing</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowServiceForm(!showServiceForm)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">+ Service</button>
          <button onClick={() => setShowRateForm(!showRateForm)} className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700">+ Rate</button>
        </div>
      </div>

      {showServiceForm && (
        <form onSubmit={handleCreateService} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col md:flex-row gap-3">
          <input required placeholder="Service Name (e.g. B&W Xerox)" value={svcForm.name} onChange={e => setSvcForm({ ...svcForm, name: e.target.value })} className="border rounded-lg px-3 py-2 text-sm flex-1" />
          <input placeholder="Description" value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} className="border rounded-lg px-3 py-2 text-sm flex-1" />
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-indigo-700">Save Service</button>
        </form>
      )}

      {showRateForm && (
        <form onSubmit={handleCreateRate} className="bg-white p-5 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3">
          <select required value={rateForm.serviceId} onChange={e => setRateForm({ ...rateForm, serviceId: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Select Service</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={rateForm.paperSize} onChange={e => setRateForm({ ...rateForm, paperSize: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="A4">A4</option><option value="A3">A3</option><option value="A5">A5</option><option value="LEGAL">Legal</option>
          </select>
          <select value={rateForm.sides} onChange={e => setRateForm({ ...rateForm, sides: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
            <option value="SINGLE">Single Side</option><option value="DOUBLE">Double Side</option>
          </select>
          <input required type="number" step="0.01" placeholder="Price per Page (₹)" value={rateForm.pricePerPage} onChange={e => setRateForm({ ...rateForm, pricePerPage: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="bg-cyan-600 text-white rounded-lg py-2 font-semibold hover:bg-cyan-700">Save Rate</button>
        </form>
      )}

      {/* Services List */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-3">Registered Services</h3>
        {services.length === 0 ? <p className="text-sm text-gray-400">No services yet. Click "+ Service" above.</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map(s => (
              <div key={s.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="font-semibold text-gray-800">{s.name}</div>
                <div className="text-xs text-gray-500 mt-1">{s.description || 'No description'}</div>
                <span className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-semibold ${s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr><th className="py-3 px-4">Service</th><th className="py-3 px-4">Paper Size</th><th className="py-3 px-4">Sides</th><th className="py-3 px-4">₹/Page</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rates.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-800">{r.serviceName}</td>
                <td className="py-3 px-4">{r.paperSize}</td>
                <td className="py-3 px-4">{r.sides}</td>
                <td className="py-3 px-4 font-bold text-indigo-600">₹{Number(r.pricePerPage).toFixed(2)}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>{r.active ? 'Active' : 'Inactive'}</span></td>
                <td className="py-3 px-4"><button onClick={() => handleDeleteRate(r.id)} className="text-rose-500 hover:underline text-xs font-semibold">Delete</button></td>
              </tr>
            ))}
            {rates.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400">No rates configured</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
