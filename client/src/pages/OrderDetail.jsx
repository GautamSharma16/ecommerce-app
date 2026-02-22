import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function OrderDetail() {
  const { id } = useParams();
  const { fetchCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Payment script failed to load');
      return;
    }
    try {
      const { data } = await api.post('/payments/create-razorpay-order', { orderId: order._id });
      const { razorpayOrderId, amount, keyId } = data;
      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Ecommerce',
        description: 'Order payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify-razorpay', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            toast.success('Payment successful!');
            setOrder({ ...order, isPaid: true, paidAt: new Date() });
            fetchCart();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: { name: order.shippingAddress?.name, contact: order.shippingAddress?.phone },
        theme: { color: '#18181b' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start payment');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="h-4 bg-zinc-200 rounded w-32 mb-6 animate-pulse" />
        <div className="h-28 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="page-heading mb-2">Order not found</h1>
        <p className="text-zinc-500 mb-6">This order may not exist or you don&apos;t have access to it.</p>
        <Link to="/orders" className="btn-primary">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <Link to="/orders" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to orders
      </Link>
      <h1 className="page-heading mb-2">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-zinc-500 mb-10">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>

      <div className="section-card space-y-8">
        <div>
          <h2 className="font-display font-bold text-zinc-900 mb-4">Items</h2>
          <ul className="divide-y divide-zinc-100">
            {order.orderItems.map((item) => (
              <li key={item._id} className="py-4 flex gap-4 first:pt-0">
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-zinc-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-zinc-900">{item.name}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                </div>
                <p className="font-bold text-zinc-900 shrink-0">${(item.qty * item.price).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-zinc-900 mb-3">Shipping address</h2>
          <p className="font-medium text-zinc-900">{order.shippingAddress?.name}</p>
          <p className="text-zinc-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
          <p className="text-zinc-600">{order.shippingAddress?.country}</p>
          {order.shippingAddress?.phone && <p className="text-zinc-600 mt-1">{order.shippingAddress.phone}</p>}
        </div>

        <div className="border-t border-zinc-100 pt-6 space-y-2">
          <p className="flex justify-between text-zinc-600"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></p>
          <p className="flex justify-between text-zinc-600"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></p>
          <p className="flex justify-between text-zinc-600"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></p>
          <p className="flex justify-between font-bold text-zinc-950 text-lg pt-4">Total <span>${order.totalPrice.toFixed(2)}</span></p>
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {order.isPaid ? 'Paid' : 'Pending payment'}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 capitalize">{order.status}</span>
          {!order.isPaid && order.status !== 'cancelled' && (
            <button onClick={handlePayment} className="btn-primary py-2.5 px-6 ml-auto">Pay now</button>
          )}
        </div>
      </div>
    </div>
  );
}
