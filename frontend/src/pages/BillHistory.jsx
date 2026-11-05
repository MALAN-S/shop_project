import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function BillHistory() {
  const [bills, setBills] = useState([]);
  const [searchBill, setSearchBill] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  const load = () => { api.get('/bill-history').then(r => setBills(r.data)); };
  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this bill? Stock will be restored for product items.')) return;
    try {
      await api.post(`/bill-history/${id}/cancel`);
      load(); setSelectedBill(null);
    } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const filteredBills = searchBill
    ? bills.filter(b => b.billNumber.toLowerCase().includes(searchBill.toLowerCase()))
    : bills;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">🧾 Bill History</h1><p className="text-sm text-gray-500">View, search, and manage past transactions</p></div>

      <input placeholder="Search by bill number..." value={searchBill} onChange={e => setSearchBill(e.target.value)}
        className="border rounded-lg px-4 py-2 text-sm w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr><th className="py-3 px-4">Bill #</th><th className="py-3 px-4">Total</th><th className="py-3 px-4">Method</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Date</th><th className="py-3 px-4">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.map(b => (
                <tr key={b.id} className={`hover:bg-gray-50 cursor-pointer ${selectedBill?.id === b.id ? 'bg-indigo-50' : ''}`} onClick={() => setSelectedBill(b)}>
                  <td className="py-3 px-4 font-semibold text-indigo-600">{b.billNumber}</td>
                  <td className="py-3 px-4 font-bold">₹{Number(b.grandTotal).toFixed(2)}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100">{b.paymentMethod}</span></td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{b.status}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">{b.createdAt ? new Date(b.createdAt).toLocaleString('en-IN') : '-'}</td>
                  <td className="py-3 px-4">
                    {b.status === 'COMPLETED' && (
                      <button onClick={(e) => { e.stopPropagation(); handleCancel(b.id); }} className="text-rose-500 hover:underline text-xs font-semibold">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400">No bills found</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Bill Detail Panel */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          {selectedBill ? (
            <div>
              <h3 className="font-bold text-gray-800 mb-1">{selectedBill.billNumber}</h3>
              <p className="text-xs text-gray-400 mb-4">{selectedBill.createdAt ? new Date(selectedBill.createdAt).toLocaleString('en-IN') : ''}</p>
              <div className="space-y-2 border-b pb-3 mb-3">
                {(selectedBill.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div><span className="font-medium">{item.itemName}</span> <span className="text-gray-400">x{item.quantity}</span></div>
                    <span className="font-bold">₹{Number(item.totalPrice).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{Number(selectedBill.totalAmount).toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Discount</span><span>-₹{Number(selectedBill.discount).toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t pt-2 mt-2"><span>Grand Total</span><span className="text-indigo-600">₹{Number(selectedBill.grandTotal).toFixed(2)}</span></div>
              <div className="mt-3 text-xs text-gray-500">Payment: {selectedBill.paymentMethod} • Status: {selectedBill.status}</div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">Click a bill to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
