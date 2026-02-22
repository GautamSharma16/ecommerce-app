import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiHeart, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(false); // Close menu on route change
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-zinc-200 shadow-sm' : 'bg-white/95 border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link to="/" className="font-display text-2xl font-black text-zinc-950 tracking-tighter">
            STYLE.
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-100/50 border border-transparent hover:bg-zinc-100 hover:border-zinc-200 focus:bg-white focus:border-zinc-300 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none transition-all duration-300"
            />
          </form>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/shop" className="btn-ghost text-sm font-medium">Shop</Link>
            {user ? (
              <>
                <Link to="/orders" className="btn-ghost text-sm font-medium">Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-ghost text-sm font-semibold">Admin</Link>
                )}
                <div className="w-px h-4 bg-zinc-200 mx-2" />
                <Link to="/profile" className="btn-ghost p-2" title="Profile">
                  <FiUser className="w-5 h-5" />
                </Link>
                <Link to="/cart" className="btn-ghost p-2 relative" title="Cart">
                  <FiShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-zinc-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <button type="button" onClick={logout} className="btn-secondary text-sm ml-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm font-medium">Log in</Link>
                <Link to="/register" className="btn-primary text-sm shadow-sm py-2 px-6">Sign up</Link>
                <Link to="/cart" className="btn-ghost p-2 relative ml-2" title="Cart">
                  <FiShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-zinc-950 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
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
          <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200 shadow-2xl py-6 space-y-4 animate-fade-in px-4">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-12 pr-4 text-sm outline-none"
              />
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/shop" className="block px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">Shop</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">Profile</Link>
                  <Link to="/orders" className="block px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">Orders</Link>
                  <Link to="/cart" className="flex items-center justify-between px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">
                    Cart
                    <span className="bg-zinc-100 text-zinc-950 text-xs px-2 py-1 rounded-full">{cartCount}</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-3 font-bold hover:bg-zinc-50 rounded-lg">Admin Dashboard</Link>
                  )}
                  <button type="button" className="block w-full text-left px-4 py-3 font-medium text-red-600 hover:bg-red-50 rounded-lg mt-4" onClick={logout}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">Log in</Link>
                  <Link to="/register" className="block px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">Sign up</Link>
                  <Link to="/cart" className="flex items-center justify-between px-4 py-3 font-medium hover:bg-zinc-50 rounded-lg">
                    Cart
                    <span className="bg-zinc-100 text-zinc-950 text-xs px-2 py-1 rounded-full">{cartCount}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
