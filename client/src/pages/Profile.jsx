import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', { name });
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-14">
      <h1 className="page-heading">Profile</h1>
      <p className="page-subheading mt-2 mb-10">Update your display name and view account details.</p>

      <form onSubmit={handleSubmit} className="section-card space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
          <input type="email" value={user?.email || ''} className="input bg-zinc-50 cursor-not-allowed" readOnly disabled />
        </div>
        <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <div className="section-card">
        <h2 className="font-display font-bold text-zinc-900 mb-2">Quick links</h2>
        <p className="text-zinc-500 text-sm mb-4">Manage your orders and activity.</p>
        <Link to="/orders" className="inline-flex items-center gap-2 font-semibold text-zinc-900 hover:underline">
          View my orders
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
      </div>
    </div>
  );
}
