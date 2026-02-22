import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-auto border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl font-black text-white tracking-tighter hover:text-zinc-200 transition-colors">STYLE.</Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">Premium clothing for the modern individual. Designed with purpose and crafted with care.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=Men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Join our list for exclusive drops and updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all placeholder:text-zinc-600"
              />
              <button className="bg-white text-zinc-950 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
          <p>&copy; {new Date().getFullYear()} STYLE. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
