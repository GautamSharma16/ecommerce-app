import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Login to add to wishlist');
      return;
    }
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/wishlist', { productId: product._id });
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Login to add to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400';
  const secondaryImage = product.images?.[1]?.url;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-2xl mb-4 shadow-sm">
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${secondaryImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-110'}`}
        />
        {/* Secondary Image (Hover) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] scale-105 group-hover:opacity-100 group-hover:scale-100"
          />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-zinc-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges & Wishlist */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.compareAtPrice > product.price && (
            <span className="bg-zinc-950 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
              Sale
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-white text-zinc-950 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
              New
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm z-20"
          aria-label="Wishlist"
        >
          <FiHeart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`} />
        </button>

        {/* Quick Add Bottom Bar */}
        <div className="absolute inset-x-4 bottom-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur-sm text-zinc-950 text-sm font-bold py-3.5 rounded-xl hover:bg-zinc-950 hover:text-white transition-colors duration-300 shadow-lg border border-white/20"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="px-1">
        <h3 className="font-semibold text-zinc-950 text-base truncate group-hover:text-zinc-600 transition-colors">{product.name}</h3>
        <p className="text-zinc-500 text-sm mb-1">{product.category}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-zinc-950">${product.price.toFixed(2)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-zinc-400 text-sm line-through font-medium">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
