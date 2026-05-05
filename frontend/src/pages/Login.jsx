import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your placement journey</p>
        </div>
        
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
