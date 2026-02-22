import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="h-9 bg-zinc-200 rounded w-48 mb-2 animate-pulse" />
        <div className="h-4 bg-zinc-100 rounded w-72 mb-10 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="page-heading">My orders</h1>
      <p className="page-subheading mt-2 mb-10">View order history, track status, and see details for each purchase.</p>

      {orders.length === 0 ? (
        <div className="section-card text-center py-16">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h3 className="font-display text-xl font-bold text-zinc-900 mb-2">No orders yet</h3>
          <p className="text-zinc-500 mb-6 max-w-sm mx-auto">When you place an order, it will appear here.</p>
          <Link to="/shop" className="btn-primary">Browse shop</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-soft hover:border-zinc-200 transition-all duration-200"
            >
              <div>
                <p className="font-semibold text-zinc-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-zinc-500 mt-1">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {!order.isPaid && order.status !== 'cancelled' && (
                  <button
                    className="btn-primary text-sm py-2 px-4"
                    onClick={(e) => { e.preventDefault(); navigate(`/orders/${order._id}`); }}
                  >
                    Pay now
                  </button>
                )}
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
                <span className="font-bold text-zinc-900">${order.totalPrice.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
