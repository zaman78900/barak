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
      // Call the real backend API for authentication
      const response = await api.post('/auth/login', { email, password });
      
      console.log('[Login] Response received:', {
        hasToken: !!response.token,
        hasUser: !!response.user,
        responseKeys: Object.keys(response),
        tokenFormat: response.token?.startsWith('eyJ') ? 'JWT✓' : 'INVALID',
      });
      
      if (response.token) {
        // Store in localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user || {}));
        
        console.log('[Login] Auth stored successfully:', {
          tokenStored: !!localStorage.getItem('authToken'),
          userStored: !!localStorage.getItem('adminUser'),
        });
        
        // Redirect after brief delay
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        console.error('[Login] No token in response:', response);
        setError('Login failed - no token received from server');
      }
    } catch (err) {
      console.error('[Login] Error occurred:', {
        message: err.message || err,
        error: err.error || err,
        fullError: String(err),
      });
      setError(err.error || err.message || 'Login failed. Please check your credentials or backend status.');
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
        email: 'barakadmin@gmail.com', 
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
                placeholder="barakadmin@gmail.com"
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
