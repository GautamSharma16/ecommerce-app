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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-bold mb-2">Profile</h1>
      <p className="text-stone-600 mb-8">Update your display name and view your account details.</p>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
          <input type="email" value={user?.email || ''} className="input bg-stone-50" readOnly disabled />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
      <div className="card p-6">
        <h2 className="font-semibold mb-2">Quick links</h2>
        <p className="text-stone-600 text-sm mb-4">Manage your orders and activity.</p>
        <Link to="/orders" className="text-brand-600 font-medium hover:underline">View my orders →</Link>
      </div>
    </div>
  );
}
