import { Outlet, NavLink, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-stone-100 flex">
      <aside className="w-56 bg-stone-900 text-white shrink-0 p-4">
        <Link to="/" className="font-display text-xl font-bold text-brand-400 block mb-8">STYLE Admin</Link>
        <nav className="space-y-1">
          <NavLink to="/admin" end className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Products
          </NavLink>
          <NavLink to="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Orders
          </NavLink>
          <NavLink to="/admin/users" className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Users
          </NavLink>
          <NavLink to="/admin/categories" className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Categories
          </NavLink>
          <NavLink to="/admin/coupons" className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Coupons
          </NavLink>
          <NavLink to="/admin/reviews" className="block px-4 py-2 rounded-lg hover:bg-stone-800" style={({ isActive }) => (isActive ? { backgroundColor: 'rgb(30 41 59)' } : {})}>
            Reviews
          </NavLink>
        </nav>
        <Link to="/" className="block mt-8 text-sm text-stone-400 hover:text-white">← Back to store</Link>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
