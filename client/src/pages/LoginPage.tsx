import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/users/login', form);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-bookBeige text-bookBrown items-center p-6 max-w-md w-full">
        <h1 className="text-2xl text-bookBrown font-bold text-center mb-2">Welcome</h1>
        <p className="text-center text-bookBrown/80 mb-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-bookAccent hover:underline">
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-bookBorder rounded focus:outline-none focus:ring-2 focus:ring-bookAccent"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-bookBorder rounded focus:outline-none focus:ring-2 focus:ring-bookAccent"
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-bookAccent hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-bookAccent text-white py-2 rounded hover:bg-bookAccentHover transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="my-4 text-center text-bookBrown/70">or</div>
        <button className="w-full flex items-center justify-center border border-bookBorder py-2 rounded hover:bg-bookTan transition duration-200 mb-2">
          <img src="/Google_Icon.png" alt="Google Logo" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center border border-bookBorder py-2 rounded hover:bg-bookTan transition duration-200">
          <img src="/Apple_Icon.png" alt="Apple Logo" className="w-5 h-5 mr-2" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
