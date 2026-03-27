import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="page-heading">Welcome back</h1>
          <p className="page-subheading mt-2">Sign in to manage orders, wishlist, and profile.</p>
        </div>
        <div className="section-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
            </div>
            <div className="flex justify-end mt-2">
             <Link
               to="/forgot-password"
               className="text-sm text-blue-600 hover:underline"
                                                                >
               Forgot Password?
            </Link>
           </div>
            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-zinc-500 text-sm">
          Don&apos;t have an account? <Link to="/register" className="font-semibold text-zinc-900 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
