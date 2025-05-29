'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        setResult('Login successful! Token: ' + data.token);
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Admin Login Test</h1>
      
      {error && (
        <div style={{ background: '#ffeeee', color: '#990000', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      {result && (
        <div style={{ background: '#eeffee', color: '#009900', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}>
          {result}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            background: '#0070f3', 
            color: 'white', 
            padding: '0.75rem 1rem', 
            borderRadius: '4px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f7f7f7', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Debug Information:</h2>
        <pre style={{ overflowX: 'auto' }}>
          Login Credentials: admin@example.com / admin123
        </pre>
      </div>
    </div>
  );
}
