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

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-stone-600 mb-8">Overview of your store: users, products, orders, and total sales. Click a card to go to that section.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link || '#'}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-stone-500 text-sm">{c.label}</p>
            <p className="text-2xl font-bold mt-2">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
