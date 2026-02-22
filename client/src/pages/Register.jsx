import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      const message = data?.message || (Array.isArray(data?.errors) && data.errors[0]?.msg) || data?.errors?.[0]?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="page-heading">Create account</h1>
          <p className="page-subheading mt-2">Join to shop, save wishlists, and track orders.</p>
        </div>
        <div className="section-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Password (min 6 characters)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" minLength={6} required />
            </div>
            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? 'Creating…' : 'Sign up'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-zinc-500 text-sm">
          Already have an account? <Link to="/login" className="font-semibold text-zinc-900 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
