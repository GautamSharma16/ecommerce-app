import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/admin/orders?${params}`)
      .then(({ data }) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status });
      toast.success('Order updated');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const triggerRefund = async (orderId) => {
    if (!window.confirm('Are you sure you want to refund this order via Razorpay?')) return;
    try {
      await api.post(`/admin/orders/${orderId}/refund`);
      toast.success('Refund processed successfully');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to refund. Make sure RAZORPAY API keys are valid.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="text-stone-600 text-sm mt-1">View all orders and update status (pending, shipped, delivered).</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading orders...</p>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Paid</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-stone-100">
                    <td className="p-4 font-mono text-sm">{order._id.slice(-8)}</td>
                    <td className="p-4">{order.user?.name} ({order.user?.email})</td>
                    <td className="p-4">${order.totalPrice?.toFixed(2)}</td>
                    <td className="p-4">{order.isPaid ? 'Yes' : 'No'}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="input py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link to={`/orders/${order._id}`} className="text-brand-600 hover:text-brand-800 text-sm font-medium">View</Link>
                      {order.isPaid && order.status === 'cancelled' && order.paymentResult?.status !== 'refunded' && (
                        <button onClick={() => triggerRefund(order._id)} className="text-amber-600 hover:text-amber-800 text-sm font-medium ml-2">
                          Refund
                        </button>
                      )}
                      {order.paymentResult?.status === 'refunded' && (
                        <span className="text-stone-400 text-sm font-medium ml-2">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 flex justify-center gap-2">
              <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span className="flex items-center px-4">Page {page} of {totalPages}</span>
              <button type="button" className="btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
