import React from 'react';

export default function OrderInvoice({ order, translations, mode = 'bill' }) {
  if (!order || !order.matched_items || order.matched_items.length === 0) {
    return <div className="text-center p-8">Preparing bill...</div>;
  }

  const t = translations;

  if (mode === 'delivery') {
    return (
      <div className="invoice-container">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">DUKAANAI</h1>
          <h2 className="text-xl mt-1">DELIVERY NOTE</h2>
        </div>
        
        <div className="flex justify-between mb-6 text-sm">
          <div>
            <strong>Order ID:</strong> ORD-{order.order_id || order.id}
          </div>
          <div>
            <strong>Date:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
        </div>

        <h3 className="font-bold mb-3 border-b pb-2">{t.customerOrder || "Customer Order"}</h3>
        <ol className="list-decimal pl-5 mb-6 space-y-2">
          {order.matched_items.map((item, idx) => (
            <li key={idx}>
              {item.product.name} — <strong>{item.quantity} {item.product.unit}</strong>
            </li>
          ))}
        </ol>

        {order.delivery_notes && (
          <div className="bg-gray-50 p-4 rounded border mb-6">
            <strong>Delivery Instruction:</strong>
            <p className="mt-1">"{order.delivery_notes}"</p>
          </div>
        )}

        <div className="text-center border-t pt-6 mt-8">
          <div className="font-bold text-lg mb-1">Order Status</div>
          <div className="text-green-700 font-bold uppercase">{t.readyForDelivery || "READY FOR DELIVERY"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-wider">DUKAANAI</h1>
        <h2 className="text-gray-500 mt-1 uppercase text-sm tracking-widest">{t.taxInvoice || "TAX INVOICE"}</h2>
      </div>
      
      <div className="flex justify-between mb-8 text-sm">
        <div>
          <div className="text-gray-500 uppercase text-xs mb-1">Order No.</div>
          <div className="font-bold text-lg">ORD-{order.order_id || order.id}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 uppercase text-xs mb-1">Date & Time</div>
          <div className="font-medium">{new Date().toLocaleDateString()}</div>
          <div className="text-gray-500">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 uppercase text-sm tracking-wider text-gray-500 border-b pb-2">{t.orderSummary || "ORDER SUMMARY"}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">{t.product || "Product"}</th>
              <th className="text-right py-2 w-16">{t.qty || "Qty"}</th>
              <th className="text-right py-2 w-24">{t.rate || "Rate"}</th>
              <th className="text-right py-2 w-24">{t.total || "Amount"}</th>
            </tr>
          </thead>
          <tbody>
            {order.matched_items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-3 pr-2">
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-xs text-gray-500">{item.product.brand}</div>
                </td>
                <td className="text-right py-3 align-top">{item.quantity}</td>
                <td className="text-right py-3 align-top">₹{item.price_per_unit}</td>
                <td className="text-right py-3 align-top font-medium">₹{item.quantity * item.price_per_unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-48">
          <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
            <span>Subtotal</span>
            <span>₹{order.total_amount}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>{t.grandTotal || "TOTAL"}</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 text-sm text-center text-gray-500 space-y-2">
        <div className="flex justify-center gap-4">
          <span><strong>Order Status:</strong> {order.status}</span>
          <span><strong>Payment:</strong> {t.pendingPayment || "Pending"}</span>
        </div>
        <p>Thank you for shopping with us!</p>
      </div>
    </div>
  );
}
