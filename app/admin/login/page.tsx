'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-block'>
            <h1 className='text-3xl font-bold text-white'>OPS</h1>
            <p className='text-primary text-sm'>ADMIN DASHBOARD</p>
          </Link>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-lg shadow-deep p-8'>
          <h2 className='text-2xl font-extrabold text-text-primary mb-2'>Admin Login</h2>
          <p className='text-text-secondary mb-6'>Access your admin panel</p>

          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className='space-y-4'>
            {/* Email */}
            <div>
              <label className='block text-sm font-bold text-text-primary mb-2'>
                Email Address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors'
                placeholder='admin@opslogistics.com'
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-bold text-text-primary mb-2'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors'
                placeholder='••••••••'
                required
              />
            </div>

            {/* Remember Me */}
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='remember'
                className='w-4 h-4 text-primary border-border rounded'
              />
              <label htmlFor='remember' className='ml-2 text-sm text-text-secondary'>
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 pt-6 border-t border-border text-center'>
            <p className='text-sm text-text-secondary'>
              Need help?{' '}
              <a href='mailto:support@opslogistics.com' className='text-primary font-bold hover:underline'>
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-xs font-bold text-blue-900 mb-2'>Demo Credentials:</p>
          <p className='text-xs text-blue-800'>Email: admin@demo.com</p>
          <p className='text-xs text-blue-800'>Password: demo123456</p>
        </div>
      </div>
    </div>
  );
}
