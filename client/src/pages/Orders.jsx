import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-stone-600 mb-8">View order history, track status, and see details for each purchase.</p>
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-stone-500 mb-2 font-medium">No orders yet</p>
          <p className="text-stone-500 text-sm mb-6">When you place an order, it will appear here. Start shopping to see your first order.</p>
          <Link to="/shop" className="btn-primary inline-block">Browse shop</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500 transition-colors">
              <div>
                <p className="font-medium">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-sm ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
                <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
