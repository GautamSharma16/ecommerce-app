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
        theme: { color: '#0d9488' },
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-stone-600 mb-8">Enter your shipping address, then complete payment securely with Razorpay.</p>

      {step === 1 && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Full name</label>
                <input type="text" value={address.name} onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))} className="input" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Street</label>
                <input type="text" value={address.street} onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">City</label>
                <input type="text" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">State</label>
                <input type="text" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">ZIP</label>
                <input type="text" value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Country</label>
                <input type="text" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} className="input" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-600 mb-1">Phone</label>
                <input type="tel" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className="input" required />
              </div>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-stone-600">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="text-stone-600">Tax: ₹{tax.toFixed(2)}</p>
            <p className="text-stone-600">Shipping: ₹{shipping.toFixed(2)}</p>
            <p className="font-semibold text-lg mt-2">Total: ₹{total.toFixed(2)}</p>
          </div>
          <button type="button" onClick={createOrder} className="btn-primary w-full">
            Continue to Payment
          </button>
        </div>
      )}

      {step === 2 && order && (
        <div className="card p-6 space-y-6">
          <h2 className="font-semibold text-lg">Payment (Razorpay)</h2>
          <div className="space-y-2">
            <p className="text-stone-600">Order total: ₹{total.toFixed(2)}</p>
            <p className="text-sm text-stone-500">You will be redirected to Razorpay to complete the payment securely.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={openRazorpayCheckout} className="btn-primary flex-1">
              Pay with Razorpay
            </button>
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
