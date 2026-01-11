import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { authAPI } from '../services/api';

interface AuthProps {
  mode: 'signin' | 'signup';
  onAuth: (user: any, token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (mode === 'signup') {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        response = await authAPI.signup(username, email, password);
      } else {
        response = await authAPI.signin(email, password);
      }

      onAuth(response.user, response.token);
      navigate(AppRoute.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-200 p-8 md:p-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {mode === 'signin' ? 'Enter your credentials to access your dashboard.' : 'Start your AI journey today.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="johndoe"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-400/50 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => navigate(mode === 'signin' ? AppRoute.SIGNUP : AppRoute.LOGIN)}
            className="text-apple-blue font-semibold hover:underline"
            disabled={loading}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;