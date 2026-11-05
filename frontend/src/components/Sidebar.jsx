import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/billing', label: 'Billing / POS' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services & Rates' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/reports', label: 'Sales Reports' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/bill-history', label: 'Bill History' },
  { to: '/users', label: 'User Management' },
  { to: '/settings', label: 'Settings' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 text-xl font-bold text-indigo-600 border-b">Shop</div>
      <nav className="flex-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block py-2.5 px-4 hover:bg-indigo-100 ${isActive ? 'bg-indigo-200 font-medium' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

