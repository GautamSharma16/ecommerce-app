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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-bold text-center mb-2">Create account</h1>
      <p className="text-center text-stone-600 mb-8">Join us to shop, save items to your wishlist, and track orders.</p>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">Password (min 6 characters)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" minLength={6} required />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>
      <p className="text-center mt-4 text-stone-600">
        Already have an account? <Link to="/login" className="text-brand-600 font-medium">Login</Link>
      </p>
    </div>
  );
}
