import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, updateItem, removeItem } = useCart();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="page-heading">Cart</h1>
        <p className="page-subheading mt-2 mb-8">Your cart is saved when you sign in. Log in to view items and checkout.</p>
        <div className="section-card text-center py-12">
          <p className="text-zinc-600 mb-6">Please log in to view your cart.</p>
          <Link to="/login" className="btn-primary">Log in</Link>
          <p className="mt-5 text-sm text-zinc-500">Don&apos;t have an account? <Link to="/register" className="font-semibold text-zinc-900 hover:underline">Sign up</Link></p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleUpdate = (itemId, newQty) => {
    if (newQty < 1) return;
    updateItem(itemId, newQty).catch(() => toast.error('Failed to update'));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="page-heading">Cart</h1>
        <p className="page-subheading mt-2 mb-8">Items you add will appear here. When you&apos;re ready, proceed to checkout.</p>
        <div className="section-card text-center py-16">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h2 className="font-display text-xl font-bold text-zinc-900 mb-2">Your cart is empty</h2>
          <p className="text-zinc-500 mb-6">Add items from the shop to get started.</p>
          <Link to="/shop" className="btn-primary">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="page-heading">Cart</h1>
      <p className="page-subheading mt-2 mb-10">Review your items, update quantities, and proceed to checkout when ready.</p>
      <div className="card overflow-hidden">
        <ul className="divide-y divide-zinc-100">
          {items.map((item) => (
            <li key={item._id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shrink-0 bg-zinc-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-900 truncate">{item.name}</h3>
                {(item.size || item.color) && (
                  <p className="text-sm text-zinc-500 mt-0.5">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
                )}
                <p className="text-zinc-900 font-bold mt-1">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1 border border-zinc-200 rounded-xl overflow-hidden">
                  <button type="button" className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors" onClick={() => handleUpdate(item._id, item.qty - 1)}>−</button>
                  <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                  <button type="button" className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors" onClick={() => handleUpdate(item._id, item.qty + 1)}>+</button>
                </div>
                <p className="font-bold text-zinc-900">${(item.price * item.qty).toFixed(2)}</p>
                <button type="button" onClick={() => removeItem(item._id)} className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline" disabled={loading}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-5 sm:p-6 bg-zinc-50/80 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-bold text-lg text-zinc-900">Subtotal: ${subtotal.toFixed(2)}</p>
          <Link to="/checkout" className="btn-primary w-full sm:w-auto">Proceed to checkout</Link>
        </div>
      </div>
    </div>
  );
}
