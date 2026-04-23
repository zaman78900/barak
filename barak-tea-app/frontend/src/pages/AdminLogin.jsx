import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For testing: Create a mock token if credentials are provided
      // In production, this would call the real API
      if (email && password) {
        // Generate a mock JWT-like token for testing
        const mockToken = btoa(JSON.stringify({ 
          userId: 'test-admin', 
          email: email, 
          role: 'admin',
          iat: Date.now(),
          exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        }));
        
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('adminUser', JSON.stringify({ 
          id: 'test-admin',
          email: email, 
          role: 'admin' 
        }));
        window.location.href = '/admin';
        return;
      }

      // Try real API login
      const response = await api.post('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        window.location.href = '/admin';
      }
    } catch (err) {
      setError(err.error || 'Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try to authenticate with demo credentials
      const response = await api.post('/auth/login', { 
        email: 'admin@barak.tea', 
        password: 'admin123' 
      });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Demo login not available. Please check backend status.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 px-4 bg-barak-dark flex items-center justify-center"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-barak-surface border border-barak-border rounded-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-barak-cream mb-2">BARAK TEA</h1>
            <p className="text-barak-muted">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-barak-muted text-sm font-semibold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barak.tea"
                className="w-full bg-barak-bg border border-barak-border rounded px-4 py-2 text-barak-cream placeholder-barak-muted outline-none focus:border-barak-gold"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-barak-muted text-sm font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-barak-bg border border-barak-border rounded px-4 py-2 text-barak-cream placeholder-barak-muted outline-none focus:border-barak-gold"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-barak-gold text-barak-dark font-bold py-2 rounded mt-6 hover:bg-barak-gold-light disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-barak-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-barak-surface text-barak-muted">Or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full border border-barak-gold text-barak-gold font-bold py-2 rounded hover:bg-barak-gold/10 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Demo Login'}
          </button>

          <p className="text-center text-barak-muted text-xs mt-6">
            Use demo credentials to test the admin panel
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
