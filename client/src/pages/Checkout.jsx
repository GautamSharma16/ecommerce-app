import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

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

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  useEffect(() => {
    if (items.length === 0 && !order) navigate('/cart');
  }, [items.length, order, navigate]);

  const createOrder = async () => {
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod: 'razorpay',
      });
      setOrder(data);
      setStep(2);
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
  };

  const openRazorpayCheckout = async () => {
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
            navigate(`/orders/${order._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#18181b' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start payment');
    }
  };

  if (items.length === 0 && !order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="page-heading">Checkout</h1>
      <p className="page-subheading mt-2 mb-10">Enter your shipping address, then complete payment securely with Razorpay.</p>

      {step === 1 && (
        <div className="space-y-8">
          <div className="section-card">
            <h2 className="font-display font-bold text-zinc-900 text-lg mb-6">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Full name</label>
                <input type="text" value={address.name} onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))} className="input" placeholder="John Doe" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Street address</label>
                <input type="text" value={address.street} onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))} className="input" placeholder="123 Main St" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">State</label>
                <input type="text" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">ZIP code</label>
                <input type="text" value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Country</label>
                <input type="text" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} className="input" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Phone</label>
                <input type="tel" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className="input" placeholder="+1 234 567 8900" required />
              </div>
            </div>
          </div>
          <div className="section-card">
            <h2 className="font-display font-bold text-zinc-900 mb-4">Order summary</h2>
            <div className="space-y-2 text-zinc-600">
              <p className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>₹{tax.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></p>
            </div>
            <p className="flex justify-between font-bold text-zinc-900 text-lg mt-4 pt-4 border-t border-zinc-100">Total <span>₹{total.toFixed(2)}</span></p>
          </div>
          <button type="button" onClick={createOrder} className="btn-primary w-full py-3.5">
            Continue to payment
          </button>
        </div>
      )}

      {step === 2 && order && (
        <div className="section-card space-y-6">
          <h2 className="font-display font-bold text-zinc-900 text-lg">Payment (Razorpay)</h2>
          <p className="text-zinc-600">Order total: <span className="font-bold text-zinc-900">₹{total.toFixed(2)}</span></p>
          <p className="text-sm text-zinc-500">You will be redirected to Razorpay to complete the payment securely.</p>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={openRazorpayCheckout} className="btn-primary flex-1 py-3.5">
              Pay with Razorpay
            </button>
            <button type="button" onClick={() => setStep(1)} className="btn-secondary py-3.5">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
