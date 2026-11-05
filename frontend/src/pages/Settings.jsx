import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">⚙️ Shop Settings</h1><p className="text-sm text-gray-500">Application configuration and shop profile</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Shop Profile</h3>
          <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Shop Name</label><input defaultValue="Xerox Shop" className="border rounded-lg px-3 py-2 text-sm w-full" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Address</label><textarea rows="2" className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="Shop address for receipts..."></textarea></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Phone</label><input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="+91 98765 43210" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Timezone</label><input defaultValue="Asia/Kolkata" disabled className="border rounded-lg px-3 py-2 text-sm w-full bg-gray-50" /></div>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 text-sm">Save Profile</button>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Receipt Settings</h3>
          <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Receipt Header Note</label><input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="Thank you for visiting!" /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Receipt Footer Note</label><input className="border rounded-lg px-3 py-2 text-sm w-full" placeholder="Visit again!" /></div>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 text-sm">Save Receipt Settings</button>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">System Info</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Backend</span><span className="font-semibold">Spring Boot 3.2.2</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Frontend</span><span className="font-semibold">React 18 + Tailwind CSS</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Database</span><span className="font-semibold">PostgreSQL</span></div>
            <div className="flex justify-between"><span className="text-gray-500">API Base</span><span className="font-mono text-xs text-indigo-600">http://localhost:8080/api</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
