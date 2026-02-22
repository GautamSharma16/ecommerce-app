import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    api.get(`/products/slug/${slug}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user || !product) return;
    api.get('/wishlist')
      .then(({ data }) => setWishlisted(data.products?.some((p) => p._id === product._id)))
      .catch(() => {});
  }, [user, product]);

  const toggleWishlist = async () => {
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

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Login to add to cart');
      return;
    }
    if (product.stock < qty) {
      toast.error('Insufficient stock');
      return;
    }
    try {
      await addToCart(product._id, qty, selectedSize, selectedColor);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    try {
      await api.post(`/reviews/${product._id}`, { rating: review.rating, comment: review.comment });
      setProduct((p) => ({
        ...p,
        reviews: [...(p.reviews || []), { user: user._id, name: user.name, rating: review.rating, comment: review.comment }],
        numReviews: p.numReviews + 1,
        rating: ((p.rating * p.numReviews) + review.rating) / (p.numReviews + 1),
      }));
      setReview({ rating: 5, comment: '' });
      toast.success('Review submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };
  const dummyFeatured = [
    {
      _id: '1',
      slug: 'premium-cotton-tee',
      name: 'Premium Cotton Tee',
      price: 49.99,
      images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' }]
    },
    {
      _id: '2',
      slug: 'classic-denim-jacket',
      name: 'Classic Denim Jacket',
      price: 129.99,
      images: [{ url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' }]
    },
    {
      _id: '3',
      slug: 'leather-booties',
      name: 'Leather Booties',
      price: 189.99,
      images: [{ url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' }]
    },
    {
      _id: '4',
      slug: 'wool-blend-coat',
      name: 'Wool Blend Coat',
      price: 299.99,
      images: [{ url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400' }]
    },
    {
      _id: '5',
      slug: 'silk-blouse',
      name: 'Silk Blouse',
      price: 89.99,
      images: [{ url: 'https://images.unsplash.com/photo-1551045235-d9483e219b7f?w=400' }]
    },
    {
      _id: '6',
      slug: 'cargo-pants',
      name: 'Cargo Pants',
      price: 79.99,
      images: [{ url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400' }]
    },
    {
      _id: '7',
      slug: 'knit-sweater',
      name: 'Knit Sweater',
      price: 119.99,
      images: [{ url: 'https://images.unsplash.com/photo-1576565404889-e3fe5d1ec842?w=400' }]
    },
    {
      _id: '8',
      slug: 'leather-belt',
      name: 'Leather Belt',
      price: 39.99,
      images: [{ url: 'https://images.unsplash.com/photo-1553062465-b612787c76e9?w=400' }]
    }
  ];
  
  const dummyCategories = ['Men', 'Women', 'Accessories', 'Footwear', 'Outerwear', 'Sale'];

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><p className="text-stone-500">Loading product...</p></div>;
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-stone-600 mb-6">This item may have been removed or the link might be incorrect. Browse our shop to find something you like.</p>
        <Link to="/shop" className="btn-primary">Browse shop</Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-stone-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-brand-600">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{product.name}</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-brand-600 font-semibold text-xl">${product.price.toFixed(2)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-stone-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="mt-4 text-stone-600">{product.description}</p>
          {product.rating > 0 && (
            <p className="mt-2 text-sm text-stone-500">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </p>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-stone-600 mb-2">Size</label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg border ${selectedSize === s ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-stone-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-stone-600 mb-2">Color</label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-lg border ${selectedColor === c ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-stone-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
              <button type="button" className="px-3 py-2 border-r border-stone-300" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
              <button type="button" className="px-3 py-2 border-l border-stone-300" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button type="button" onClick={handleAddToCart} className="btn-primary flex-1" disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            {user && (
              <button type="button" onClick={toggleWishlist} className="p-2 rounded-lg border border-stone-300 hover:bg-stone-50">
                <FiHeart className={`w-5 h-5 ${wishlisted ? 'fill-brand-600 text-brand-600' : ''}`} />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-stone-500">In stock: {product.stock}</p>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-stone-200 pt-10">
        <h2 className="font-display text-xl font-bold mb-6">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="card p-6 mb-8">
            <label className="block text-sm font-medium mb-2">Your rating</label>
            <select value={review.rating} onChange={(e) => setReview((r) => ({ ...r, rating: Number(e.target.value) }))} className="input max-w-xs mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea value={review.comment} onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))} className="input min-h-[100px]" required />
            <button type="submit" className="btn-primary mt-4" disabled={submittingReview}>Submit Review</button>
          </form>
        )}
        <div className="space-y-4">
          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="mt-2 text-stone-600">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-stone-500">No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
