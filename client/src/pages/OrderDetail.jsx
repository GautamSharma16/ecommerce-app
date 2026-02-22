import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!order) return <div className="max-w-2xl mx-auto px-4 py-16 text-center">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-brand-600 hover:underline mb-6 inline-block">← Back to orders</Link>
      <h1 className="font-display text-2xl font-bold mb-2">Order #{order._id.slice(-8)}</h1>
      <p className="text-stone-600 mb-6">Order placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}. View items, shipping, and payment details below.</p>
      <div className="card p-6 space-y-6">
        <div>
          <h2 className="font-semibold mb-2">Items</h2>
          <ul className="divide-y divide-stone-200">
            {order.orderItems.map((item) => (
              <li key={item._id} className="py-3 flex gap-4">
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-stone-500">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                </div>
                <p className="font-semibold">${(item.qty * item.price).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Shipping</h2>
          <p>{order.shippingAddress?.name}</p>
          <p className="text-stone-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
          <p className="text-stone-600">{order.shippingAddress?.country}</p>
        </div>
        <div className="border-t border-stone-200 pt-4">
          <p>Subtotal: ${order.itemsPrice.toFixed(2)}</p>
          <p>Tax: ${order.taxPrice.toFixed(2)}</p>
          <p>Shipping: ${order.shippingPrice.toFixed(2)}</p>
          <p className="font-semibold text-lg mt-2">Total: ${order.totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {order.isPaid ? 'Paid' : 'Pending payment'}
          </span>
          <span className="px-2 py-1 rounded text-sm bg-stone-100">{order.status}</span>
        </div>
      </div>
    </div>
  );
}
