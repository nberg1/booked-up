import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
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
      // Adjust the payload as needed by your backend (e.g., combining firstName and lastName into username)
      const payload = {
        username: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
      };

      const response = await axios.post('/api/users/signup', payload);
      // Assume response contains a token and user data
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/');      // Optionally, store user data in context or state management
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="bg-bookBeige text-bookBrown items-center p-6 max-w-md w-full">
        <h1 className="text-2xl text-bookBrown font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-bookBrown/80 mb-6">
          Already have an account?{' '}
          <Link to="/login" className="text-bookAccent hover:underline">
            Login
          </Link>
        </p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-bookBorder rounded focus:outline-none focus:ring-2 focus:ring-bookAccent"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-bookBorder rounded focus:outline-none focus:ring-2 focus:ring-bookAccent"
          />
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
          <button
            type="submit"
            className="w-full bg-bookAccent text-white py-2 rounded hover:bg-bookAccentHover transition duration-200"
          >
            Create Account
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

export default CreateAccountPage;
