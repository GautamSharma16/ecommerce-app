import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.allSettled([
          api.get('/products?featured=true&limit=8'),
          api.get('/products/categories')
        ]);

        const productsList = productsRes.status === 'fulfilled' && productsRes.value.data?.products?.length
          ? productsRes.value.data.products
          : [];
        setFeatured(productsList);

        const categoriesList = categoriesRes.status === 'fulfilled' && categoriesRes.value.data?.length
          ? categoriesRes.value.data
          : [];
        setCategories(categoriesList);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse min-h-screen">
        <div className="bg-zinc-200 h-[80vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="h-4 bg-zinc-200 rounded w-32 mx-auto mb-4" />
          <div className="h-10 bg-zinc-200 rounded w-64 mx-auto mb-16" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const defaultCategoryImages = [
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'
  ];

  return (
    <div className="overflow-hidden bg-white">
      {/* Sleek Hero Section */}
      <section className="relative h-[90vh] bg-zinc-950 flex items-center justify-center overflow-hidden">
        {/* Background Image with slow zoom */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-68b9a2d6be99?auto=format&fit=crop&q=80&w=2400"
            alt="Hero Fashion"
            className="w-full h-full object-cover opacity-60 animate-[slowZoom_30s_infinite_alternate] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
          <span className="inline-block px-5 py-2 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-zinc-200 text-xs font-bold tracking-[0.2em] uppercase mb-8">
            The New Standard
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-8">
            Elevate Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Everyday Aesthetic</span>
          </h1>
          <p className="text-zinc-300 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-medium">
            Discover our curated collection of premium essentials designed for the modern wardrobe. Minimalist, timeless, and completely reimagined.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/shop" className="bg-white text-zinc-950 px-10 py-4 rounded-full font-bold hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Shop The Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-zinc-500 font-bold tracking-widest text-xs uppercase mb-3 block">Discover By</span>
          <h2 className="font-display text-4xl font-black text-zinc-950 tracking-tight">Categories</h2>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat, index) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 block"
              >
                <img
                  src={defaultCategoryImages[index % defaultCategoryImages.length]}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="font-display text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{cat}</h3>
                  <span className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-2">
                    Explore <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100 shadow-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-zinc-900 mb-3">Curating Collections</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">We are currently organizing our catalog. Check back shortly for our meticulously crafted categories.</p>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="bg-zinc-50 py-24 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-zinc-500 font-bold tracking-widest text-xs uppercase mb-3 block">Trending Now</span>
              <h2 className="font-display text-4xl font-black text-zinc-950 tracking-tight">Featured Arrivals</h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-zinc-900 font-semibold hover:text-zinc-600 transition-colors"
            >
              View Entire Collection
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 shadow-sm">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-zinc-900 mb-3">Exclusive Drops Incoming</h3>
              <p className="text-zinc-500 max-w-md mx-auto mb-8 text-lg">Our featured collection is being updated. In the meantime, explore our complete catalog.</p>
              <Link to="/shop" className="btn-primary">Explore All Products</Link>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}