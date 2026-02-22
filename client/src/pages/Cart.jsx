import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, updateItem, removeItem } = useCart();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl font-bold mb-2">Cart</h1>
        <p className="text-stone-600 mb-6">Your cart is saved when you sign in. Log in to view items, update quantities, and proceed to checkout.</p>
        <div className="card p-8 text-center">
          <p className="text-stone-600 mb-6">Please log in to view your cart.</p>
          <Link to="/login" className="btn-primary">Login</Link>
          <p className="mt-4 text-sm text-stone-500">Don&apos;t have an account? <Link to="/register" className="text-brand-600 font-medium">Sign up</Link></p>
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
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl font-bold mb-2">Cart</h1>
        <p className="text-stone-600 mb-8">Items you add will appear here. When you&apos;re ready, proceed to checkout.</p>
        <div className="card p-12 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-stone-600 mb-6">Add items from the shop to get started.</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-2">Cart</h1>
      <p className="text-stone-600 mb-8">Review your items, update quantities, and proceed to checkout when ready.</p>
      <div className="card overflow-hidden">
        <ul className="divide-y divide-stone-200">
          {items.map((item) => (
            <li key={item._id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img
                src={item.image || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                {(item.size || item.color) && (
                  <p className="text-sm text-stone-500">{[item.size, item.color].filter(Boolean).join(' / ')}</p>
                )}
                <p className="text-brand-600 font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="w-8 h-8 rounded border border-stone-300" onClick={() => handleUpdate(item._id, item.qty - 1)}>−</button>
                <span className="w-8 text-center">{item.qty}</span>
                <button type="button" className="w-8 h-8 rounded border border-stone-300" onClick={() => handleUpdate(item._id, item.qty + 1)}>+</button>
              </div>
              <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
              <button type="button" onClick={() => removeItem(item._id)} className="text-red-600 hover:underline text-sm" disabled={loading}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-lg">Subtotal: ${subtotal.toFixed(2)}</p>
          <Link to="/checkout" className="btn-primary">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
