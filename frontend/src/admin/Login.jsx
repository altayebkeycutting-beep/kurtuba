import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated) navigate('/admin', { replace: true });
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    setError('');
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { 
      setError('Please fill in all fields.');
      return; 
    }
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 key-pattern opacity-10 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gold-400 rounded-2xl items-center justify-center mb-4 shadow-gold">
            <GiKey className="text-dark text-3xl" />
          </div>
          <h1 className="text-white font-display font-bold text-3xl">Kurtuba Locksmith</h1>
          <p className="text-gold-400 text-sm mt-1">Admin Panel — Ajman, UAE</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="admin@kurtuba.com" autoComplete="email" required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg
                             text-white placeholder:text-gray-500 focus:outline-none focus:ring-2
                             focus:ring-gold-400 focus:border-transparent transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="current-password" required
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg
                             text-white placeholder:text-gray-500 focus:outline-none focus:ring-2
                             focus:ring-gold-400 focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-gold-400 text-dark font-bold rounded-lg hover:bg-gold-500
                         transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 text-sm">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs mt-6">
          <Link to="/" className="hover:text-gold-400 transition-colors">← Back to Website</Link>
        </p>
      </div>
    </div>
  );
}
