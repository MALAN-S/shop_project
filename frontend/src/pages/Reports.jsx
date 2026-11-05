import React, { useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/range', { params: { startDate, endDate } });
      setReport(res.data);
    } catch (err) { alert('Failed to load report'); }
    setLoading(false);
  };

  const fetchToday = () => { const today = new Date().toISOString().split('T')[0]; setStartDate(today); setEndDate(today); setTimeout(fetchReport, 100); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">📑 Sales Reports</h1><p className="text-sm text-gray-500">Daily, weekly, monthly, and custom date range reports</p></div>

      <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1"><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full" /></div>
        <div className="flex-1"><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-full" /></div>
        <button onClick={fetchReport} disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300">{loading ? 'Loading...' : 'Generate Report'}</button>
        <button onClick={fetchToday} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">Today</button>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Sales" value={`₹${Number(report.totalSales).toFixed(2)}`} />
            <StatCard label="Total Bills" value={report.totalBills} />
            <StatCard label="Cash Sales" value={`₹${Number(report.cashSales).toFixed(2)}`} />
            <StatCard label="UPI Sales" value={`₹${Number(report.upiSales).toFixed(2)}`} />
            <StatCard label="Card Sales" value={`₹${Number(report.cardSales).toFixed(2)}`} />
            <StatCard label="Xerox Sales" value={`₹${Number(report.xeroxSales).toFixed(2)}`} />
            <StatCard label="Color Print" value={`₹${Number(report.colorPrintSales).toFixed(2)}`} />
            <StatCard label="Stationery" value={`₹${Number(report.stationerySales).toFixed(2)}`} />
          </div>

          {report.dailySales && report.dailySales.length > 1 && (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Daily Sales Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.dailySales.map(d => ({ date: d.date, total: Number(d.total) }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', border: 'none' }} />
                    <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <div className="text-xs text-gray-400 font-semibold uppercase">{label}</div>
      <div className="text-xl font-bold text-gray-800 mt-1">{value}</div>
    </div>
  );
}
