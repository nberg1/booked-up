import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="responsive-bg">
      {/* Main Header with Navigation */}
      <div className="bg-black bg-opacity-35 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-bookTan">
            Booked Up
          </Link>
        </div>
        <nav className="mt-2 md:mt-0">
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link to="/" className="text-bookTan hover:underline">
                Book List
              </Link>
            </li>
            {isLoggedIn ? (
              <><li>
                <Link to="/finished" className="text-bookTan hover:underline">
                    Finished Book List
                </Link>
              </li><li>
                <button onClick={handleLogout} className="text-bookTan hover:underline">
                    Logout
                </button>
              </li></>
            ) : (
              <li>
              <Link to="/login" className="text-bookTan hover:underline">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {/* Sub-header for Persistent Search */}
      <div className="bg-bookBeige text-bookBrown p-4 border-t">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            className="text-bookBrown/80 flex-1 px-3 py-2 border border-bookBorder rounded focus:outline-none focus:ring-2 focus:ring-bookAccent pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-bookBrown" />
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
