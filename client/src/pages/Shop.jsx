import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
  });

  useEffect(() => {
    setFilters((f) => ({ ...f, category: searchParams.get('category') || '', search: searchParams.get('search') || '' }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', 12);
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    api.get(`/products?${params}`)
      .then(({ data }) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, filters]);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-10">
        <h1 className="page-heading">Shop</h1>
        <p className="page-subheading">Browse our full collection. Filter by category, price, or sort by newest and rating.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="section-card space-y-6 sticky top-28">
            <h2 className="font-display font-bold text-zinc-950 text-sm uppercase tracking-wider">Filters</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="input py-2.5"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Min price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                  className="input py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-2">Max price</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                  className="input py-2.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-2">Sort by</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="input py-2.5"
              >
                <option value="-createdAt">Newest first</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Top rated</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {filters.search && (
            <p className="text-zinc-500 mb-6 text-sm">Results for &quot;{filters.search}&quot;</p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-zinc-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-zinc-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="section-card text-center py-16">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900 mb-2">No products found</h3>
              <p className="text-zinc-500 mb-6 max-w-sm mx-auto">Try adjusting your filters or search term.</p>
              <button type="button" onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: '-createdAt' })} className="btn-secondary">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-12 pt-8 border-t border-zinc-100">
                  <button
                    type="button"
                    className="btn-secondary text-sm py-2.5 px-5"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-zinc-500 text-sm font-medium px-2">Page {page} of {totalPages}</span>
                  <button
                    type="button"
                    className="btn-secondary text-sm py-2.5 px-5"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
