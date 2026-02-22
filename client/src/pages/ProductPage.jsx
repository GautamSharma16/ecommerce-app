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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
      .catch(() => { });
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="h-4 bg-zinc-200 rounded w-48 mb-8 animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-zinc-100 rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-zinc-100 rounded w-24 animate-pulse" />
            <div className="h-24 bg-zinc-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h1 className="page-heading mb-2">Product not found</h1>
        <p className="text-zinc-500 mb-8">This item may have been removed or the link might be incorrect.</p>
        <Link to="/shop" className="btn-primary">Browse shop</Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/600';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm font-medium text-zinc-500 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
        <span className="text-zinc-300">/</span>
        <Link to="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-28 h-fit">
          {product.images?.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-20 shrink-0 custom-scrollbar pb-2 md:pb-0 md:max-h-[70vh]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden shrink-0 w-20 md:w-full border-2 transition-all duration-300 ${activeImageIndex === idx ? 'border-zinc-950 ring-2 ring-white ring-offset-1' : 'border-transparent hover:opacity-80'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover bg-zinc-100" alt={`${product.name} thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="relative aspect-[3/4] bg-zinc-100 rounded-2xl overflow-hidden flex-1 group">
            <img
              src={product.images?.[activeImageIndex]?.url || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <h1 className="font-display text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight">{product.name}</h1>
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-zinc-950 font-bold text-2xl">${product.price.toFixed(2)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-zinc-400 line-through text-lg font-medium">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex text-yellow-500">
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="text-sm font-medium text-zinc-500 underline underline-offset-4 decoration-zinc-300">{product.numReviews} Reviews</span>
            </div>
          )}

          <p className="mt-8 text-zinc-600 text-lg leading-relaxed">{product.description}</p>

          <div className="mt-10 space-y-8">
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Size</label>
                  <button className="text-xs font-medium text-zinc-500 underline underline-offset-4">Size Guide</button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[3rem] px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${selectedSize === s ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-900 hover:border-zinc-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-zinc-950 uppercase tracking-wider mb-3">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${selectedColor === c ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-200 text-zinc-900 hover:border-zinc-400'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-200 sticky bottom-0 bg-white z-10 pb-6">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center bg-zinc-50 rounded-xl border border-zinc-200">
                <button type="button" className="px-5 py-4 hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-900" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button type="button" className="px-5 py-4 hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-900" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary flex-1 py-4 text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-xl"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                type="button"
                onClick={toggleWishlist}
                className="p-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-colors shrink-0"
                aria-label="Add to wishlist"
              >
                <FiHeart className={`w-6 h-6 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm text-zinc-500 font-medium">In stock: {product.stock}</p>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-sm text-red-600 font-bold flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Only {product.stock} items left. Order soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 pt-12 border-t border-zinc-200">
        <h2 className="font-display text-2xl font-bold text-zinc-950 mb-8">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="section-card mb-8">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Your rating</label>
            <select value={review.rating} onChange={(e) => setReview((r) => ({ ...r, rating: Number(e.target.value) }))} className="input max-w-xs mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Comment</label>
            <textarea value={review.comment} onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))} className="input min-h-[100px]" placeholder="Share your experience..." required />
            <button type="submit" className="btn-primary mt-4" disabled={submittingReview}>Submit review</button>
          </form>
        )}
        <div className="space-y-4">
          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <div key={r._id} className="section-card">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900">{r.name}</span>
                  <span className="text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="mt-2 text-zinc-600">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-zinc-500">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>
    </div>
  );
}
