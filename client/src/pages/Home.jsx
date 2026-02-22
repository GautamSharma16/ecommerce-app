import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

// Dummy data for preview/fallback
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

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API, fallback to dummy data if fails
        const [productsRes, categoriesRes] = await Promise.allSettled([
          api.get('/products?featured=true&limit=8'),
          api.get('/products/categories')
        ]);

        setFeatured(
          productsRes.status === 'fulfilled' 
            ? productsRes.value.data.products 
            : dummyFeatured
        );
        
        setCategories(
          categoriesRes.status === 'fulfilled' 
            ? categoriesRes.value.data 
            : dummyCategories
        );
      } catch (error) {
        console.log('Using dummy data due to API error');
        setFeatured(dummyFeatured);
        setCategories(dummyCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-stone-200 h-[70vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="h-8 bg-stone-200 rounded w-64 mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-stone-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-r from-stone-900 to-stone-800 text-white min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated background overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea913ec9?w=1600')] bg-cover bg-center opacity-40"
            style={{ transform: 'scale(1.1)', animation: 'slowZoom 20s infinite alternate' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
        </div>
        
        {/* Animated particles/decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
            New Collection 2024
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            New Season
            <span className="block text-brand-400">Elevated Essentials</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-8 animate-slide-up delay-200">
            Curated pieces for every moment. Discover our latest collection designed for the modern individual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
            <Link 
              to="/shop" 
              className="group relative px-8 py-4 bg-white text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link 
              to="/collections" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-stone-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
            >
              View Collections
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <span className="text-brand-500 font-semibold tracking-wider text-sm uppercase">Shop by</span>
            <h2 className="font-display text-3xl font-bold mt-2">Categories</h2>
            <p className="text-stone-600 mt-2">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat, index) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background image with overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-stone-900/20 group-hover:scale-110 transition-transform duration-700">
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1483985988355-763728e1935b' :
                      index === 1 ? '1485230934737-89b80a0df9d9' :
                      index === 2 ? '1492709612498-9314e1b359a7' :
                      '1490481651871-68b9a2d6be99'
                    }?w=600&auto=format`}
                    alt={cat}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                  />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white transform group-hover:scale-110 transition-transform duration-500">
                    <h3 className="font-display text-2xl font-bold mb-2">{cat}</h3>
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-gradient-to-b from-white to-stone-50">
        <div className="text-center mb-12">
          <span className="text-brand-500 font-semibold tracking-wider text-sm uppercase">Trending Now</span>
          <h2 className="font-display text-3xl font-bold mt-2">Featured Products</h2>
          <p className="text-stone-600 mt-2">Most popular choices from our collection</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {featured.map((p, index) => (
            <Link 
              key={p._id} 
              to={`/product/${p.slug}`} 
              className="group card overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                <img
                  src={p.images?.[0]?.url || 'https://via.placeholder.com/400'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="block text-white text-sm font-medium text-center py-2 bg-white/20 backdrop-blur-sm rounded-full">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Sale badge (example condition) */}
                {p.price > 200 && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    SALE
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-stone-800 truncate group-hover:text-brand-600 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-brand-600 font-bold text-lg">${p.price.toFixed(2)}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {featured.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 mb-4">No featured products yet.</p>
            <Link to="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/shop" 
            className="group inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            View All Products
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .animate-scroll {
          animation: scroll 2s infinite;
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(15px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}