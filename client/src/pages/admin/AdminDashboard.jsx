import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-stone-500">Loading dashboard...</div>;
  if (!stats) return <div className="card p-6 text-red-600">Failed to load stats. Check your connection and try again.</div>;

  const cards = [
    { label: 'Total Users', value: stats.userCount, link: '/admin/users', color: 'bg-blue-500' },
    { label: 'Products', value: stats.productCount, link: '/admin/products', color: 'bg-emerald-500' },
    { label: 'Orders', value: stats.orderCount, link: '/admin/orders', color: 'bg-amber-500' },
    { label: 'Total Sales', value: `$${Number(stats.totalSales).toFixed(2)}`, color: 'bg-brand-600' },
  ];

  const maxSales = Math.max(...(stats.monthlySales?.map(m => m.sales) || [1]));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-stone-600 mb-8">Overview of your store: users, products, orders, and total sales.</p>

      {stats.lowStockCount > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <span className="text-red-700 font-medium">⚠️ Low Stock Alert:</span>
          <span className="ml-2 text-red-600">You have {stats.lowStockCount} product(s) with low stock (less than 10).</span>
          <Link to="/admin/products" className="ml-auto text-sm text-red-700 font-medium hover:underline">View Products</Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link || '#'}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
          >
            <p className="text-stone-500 text-sm font-medium">{c.label}</p>
            <p className="text-3xl font-bold font-display text-stone-900 mt-2">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
        <h2 className="font-display text-lg font-bold mb-6">Monthly Sales (Last 6 Months)</h2>
        {stats.monthlySales?.length > 0 ? (
          <div className="flex items-end h-64 gap-4">
            {stats.monthlySales.map(m => (
              <div key={m.month} className="flex-1 flex flex-col justify-end items-center group relative">
                <div className="absolute -top-8 bg-stone-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${m.sales.toFixed(2)}
                </div>
                <div className="w-full bg-brand-500 rounded-t-sm hover:bg-brand-600 transition-colors" style={{ height: `${(m.sales / maxSales) * 100}%`, minHeight: '4px' }}></div>
                <span className="text-xs text-stone-500 mt-2">{m.month}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 text-sm">No sales data available for the last 6 months.</p>
        )}
      </div>
    </div>
  );
}
