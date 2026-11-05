import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceRates, setServiceRates] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [searchTerm, setSearchTerm] = useState('');
  const [billResult, setBillResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
    api.get('/services').then(r => setServices(r.data)).catch(() => {});
    api.get('/service-rates').then(r => setServiceRates(r.data)).catch(() => {});
  }, []);

  const addProductToCart = (product) => {
    const existing = cart.find(c => c.itemId === product.id && c.type === 'PRODUCT');
    if (existing) {
      setCart(cart.map(c => c === existing ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { itemId: product.id, name: product.name, price: product.sellingPrice, qty: 1, type: 'PRODUCT', stock: product.currentStock }]);
    }
  };

  const addServiceToCart = (rate) => {
    const existing = cart.find(c => c.itemId === rate.id && c.type === 'SERVICE');
    if (existing) {
      setCart(cart.map(c => c === existing ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { itemId: rate.serviceId, rateId: rate.id, name: `${rate.serviceName} (${rate.paperSize} ${rate.sides})`, price: rate.pricePerPage, qty: 1, type: 'SERVICE' }]);
    }
  };

  const updateQty = (index, delta) => {
    setCart(cart.map((c, i) => {
      if (i === index) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, c) => sum + Number(c.price) * c.qty, 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));

  const handleCreateBill = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const items = cart.map(c => ({
        productId: c.type === 'PRODUCT' ? c.itemId : null,
        serviceId: c.type === 'SERVICE' ? c.itemId : null,
        quantity: c.qty,
        unitPrice: c.price,
      }));
      const res = await api.post('/billing/create-bill', {
        items,
        discount: Number(discount || 0),
        paymentMethod,
      });
      setBillResult(res.data);
      setCart([]);
      setDiscount(0);
      // Refresh products for updated stock
      api.get('/products').then(r => setProducts(r.data));
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to create bill');
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p =>
    p.status === 'ACTIVE' && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeRates = serviceRates.filter(r => r.active);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left: Items */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quick Billing / POS</h1>
            <p className="text-xs text-gray-500">Tap items to add to cart → complete checkout</p>
          </div>
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* Service Rates */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">⚡ Xerox & Printing Services</h2>
          {activeRates.length === 0 ? (
            <p className="text-sm text-gray-400">No service rates configured yet. Add them from Services & Rates page.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeRates.map(rate => (
                <button key={rate.id} onClick={() => addServiceToCart(rate)}
                  className="p-3 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50/40 transition group">
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-indigo-600">{rate.serviceName}</div>
                  <div className="text-xs text-gray-500">{rate.paperSize} • {rate.sides}</div>
                  <div className="text-indigo-600 font-bold text-sm mt-1">₹{Number(rate.pricePerPage).toFixed(2)}/page</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-1 overflow-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">📦 Stationery Products</h2>
          {filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No products found. Add from the Products page.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addProductToCart(p)} disabled={p.currentStock <= 0}
                  className={`p-3 text-left border rounded-lg transition group ${p.currentStock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-500 hover:bg-amber-50/30'}`}>
                  <div className="font-semibold text-sm text-gray-800 group-hover:text-amber-600">{p.name}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-amber-600 font-bold text-sm">₹{Number(p.sellingPrice).toFixed(2)}</span>
                    <span className={`text-[11px] ${p.lowStock ? 'text-rose-500 font-bold' : 'text-gray-400'}`}>Stock: {p.currentStock}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full lg:w-96 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        {billResult ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-5xl">✅</div>
            <h3 className="text-xl font-bold text-gray-800">Bill Created!</h3>
            <p className="text-indigo-600 font-bold text-lg">{billResult.billNumber}</p>
            <p className="text-2xl font-extrabold text-gray-800">₹{Number(billResult.grandTotal).toFixed(2)}</p>
            <p className="text-sm text-gray-500">{billResult.paymentMethod} • {billResult.items?.length} items</p>
            <button onClick={() => setBillResult(null)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
              New Bill
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <h2 className="font-bold text-gray-800">Current Bill</h2>
                <button onClick={() => setCart([])} className="text-xs text-rose-500 hover:underline">Clear</button>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Cart is empty. Tap items to add.</div>
                ) : cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                    <div className="flex-1 pr-2">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-400">₹{Number(item.price).toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(idx, -1)} className="w-6 h-6 rounded bg-gray-100 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-200">-</button>
                      <span className="font-semibold text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(idx, 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-200">+</button>
                    </div>
                    <div className="w-16 text-right font-bold text-gray-800">₹{(Number(item.price) * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 space-y-3 mt-4">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Discount (₹)</span>
                <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-20 px-2 py-1 text-right border rounded text-sm" min="0" />
              </div>
              <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t pt-2">
                <span>Grand Total</span><span className="text-indigo-600">₹{grandTotal.toFixed(2)}</span>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CASH', 'UPI', 'CARD'].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-xs font-bold rounded-lg border transition ${paymentMethod === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <button disabled={cart.length === 0 || loading} onClick={handleCreateBill}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                {loading ? 'Processing...' : 'Print & Complete Bill'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
