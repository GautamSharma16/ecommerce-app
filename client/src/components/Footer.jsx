import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="font-display text-xl font-bold text-white">STYLE</Link>
            <p className="mt-2 text-sm">Premium clothing for the modern wardrobe.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
              <li><Link to="/shop?category=Men" className="hover:text-white">Men</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white">Women</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-white">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Shipping</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Newsletter</h3>
            <p className="text-sm mb-2">Subscribe for updates and offers.</p>
            <input type="email" placeholder="Your email" className="input bg-stone-800 border-stone-700 text-sm py-2" />
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-stone-700 text-center text-sm">
          &copy; {new Date().getFullYear()} STYLE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
