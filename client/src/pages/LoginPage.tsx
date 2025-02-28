import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition duration-200 mb-2">
          <img src="/Google_Icon.png" alt="Google Logo" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition duration-200">
          <img src="/Apple_Icon.png" alt="Apple Logo" className="w-5 h-5 mr-2" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
