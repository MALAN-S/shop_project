import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400 text-lg">Loading dashboard...</div></div>;
  }

  const todaySales = data?.todaySales ?? 0;
  const todayBills = data?.todayBills ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const estimatedProfit = data?.estimatedProfit ?? 0;
  const xeroxSales = data?.xeroxSales ?? 0;
  const colorPrintSales = data?.colorPrintSales ?? 0;
  const stationerySales = data?.stationerySales ?? 0;
  const lowStock = data?.lowStockProducts ?? [];
  const recent = data?.recentTransactions ?? [];

  const chartData = [
    { name: 'Xerox', value: Number(xeroxSales) },
    { name: 'Color Print', value: Number(colorPrintSales) },
    { name: 'Stationery', value: Number(stationerySales) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shop Dashboard</h1>
          <p className="text-sm text-gray-500">Live sales overview • Asia/Kolkata</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">● Online</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Today's Sales" value={`₹${Number(todaySales).toFixed(2)}`} icon="💰" color="indigo" />
        <Card label="Today's Bills" value={`${todayBills} Bills`} icon="🧾" color="blue" />
        <Card label="Today's Expenses" value={`₹${Number(totalExpenses).toFixed(2)}`} icon="📉" color="rose" />
        <Card label="Estimated Profit" value={`₹${Number(estimatedProfit).toFixed(2)}`} icon="📈" color="emerald" />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniBar label="Xerox Services" value={xeroxSales} total={todaySales} color="bg-indigo-600" />
        <MiniBar label="Color Printing" value={colorPrintSales} total={todaySales} color="bg-cyan-500" />
        <MiniBar label="Stationery" value={stationerySales} total={todaySales} color="bg-amber-500" />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-4">Today's Sales by Category (₹)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none' }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Recent Transactions</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No transactions yet. Create a bill from the POS page.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>
                <th className="py-2 px-3">Bill #</th><th className="py-2 px-3">Total</th><th className="py-2 px-3">Method</th><th className="py-2 px-3">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {recent.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 font-semibold text-indigo-600">{b.billNumber}</td>
                    <td className="py-2 px-3 font-bold">₹{Number(b.grandTotal).toFixed(2)}</td>
                    <td className="py-2 px-3"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100">{b.paymentMethod}</span></td>
                    <td className="py-2 px-3 text-xs">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span className="text-amber-500">⚠️</span> Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">All products are well stocked.</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="p-3 rounded-lg border border-amber-100 bg-amber-50/50 flex justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500">Min: {p.minStockLevel}</div>
                  </div>
                  <div className="text-sm font-bold text-rose-600">{p.currentStock}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
          <h3 className={`text-2xl font-extrabold mt-1 text-${color}-600`}>{value}</h3>
        </div>
        <span className={`p-3 bg-${color}-50 text-${color}-600 rounded-lg text-lg`}>{icon}</span>
      </div>
    </div>
  );
}

function MiniBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-xs text-gray-400 font-semibold">{label}</div>
      <div className="text-xl font-bold text-gray-800 mt-1">₹{Number(value).toFixed(2)}</div>
      <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
      </div>
      <div className="text-xs text-gray-400 mt-1">{pct}% of total</div>
    </div>
  );
}
