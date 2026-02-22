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

  return (
    <Link to={`/product/${product.slug}`} className="group card overflow-hidden block">
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {user && (
          <button
            type="button"
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
            aria-label="Wishlist"
          >
            <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-brand-600 text-brand-600' : ''}`} />
          </button>
        )}
        {product.compareAtPrice > product.price && (
          <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-medium px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-brand-600 font-semibold">${product.price.toFixed(2)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-stone-400 text-sm line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>
        {user && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary w-full mt-3 text-sm py-2"
          >
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
