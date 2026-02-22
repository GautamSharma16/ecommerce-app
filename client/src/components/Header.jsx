import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="font-display text-2xl font-bold text-brand-600 tracking-tight">
            STYLE
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input py-2 text-sm"
            />
          </form>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/shop" className="btn-ghost text-sm">Shop</Link>
            {user ? (
              <>
                <Link to="/profile" className="btn-ghost p-2" title="Profile">
                  <FiUser className="w-5 h-5" />
                </Link>
                <Link to="/orders" className="btn-ghost text-sm">Orders</Link>
                <Link to="/cart" className="btn-ghost p-2 relative" title="Cart">
                  <FiShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-ghost text-sm text-brand-600">Admin</Link>
                )}
                <button type="button" onClick={logout} className="btn-ghost text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign up</Link>
                <Link to="/cart" className="btn-ghost p-2 relative" title="Cart">
                  <FiShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="md:hidden btn-ghost p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-2">
            <form onSubmit={handleSearch} className="px-2">
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input py-2 text-sm"
              />
            </form>
            <Link to="/shop" className="block px-4 py-2" onClick={() => setOpen(false)}>Shop</Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2" onClick={() => setOpen(false)}>Profile</Link>
                <Link to="/orders" className="block px-4 py-2" onClick={() => setOpen(false)}>Orders</Link>
                <Link to="/cart" className="block px-4 py-2" onClick={() => setOpen(false)}>Cart ({cartCount})</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-brand-600" onClick={() => setOpen(false)}>Admin</Link>
                )}
                <button type="button" className="block w-full text-left px-4 py-2" onClick={() => { logout(); setOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2" onClick={() => setOpen(false)}>Sign up</Link>
                <Link to="/cart" className="block px-4 py-2" onClick={() => setOpen(false)}>Cart ({cartCount})</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
