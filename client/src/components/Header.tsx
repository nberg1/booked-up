import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookmarkIcon, BookOpenIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/solid';
import ProfilePanel from './ProfilePanel';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setIsLoggedIn, setUser } = useAuth();
  const [query, setQuery] = useState('');

  // Determine active routes for highlighting icons.
  const isBooksSection = location.pathname.startsWith('/books');
  const isShortStoryPage = location.pathname.startsWith('/short-story');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null); // Clear the user data on logout.
    setIsProfileOpen(false);
    navigate('/login'); // Redirect to sign in page after logout.
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
      <div className="bg-black bg-opacity-35 p-4">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-bookTan">
          Booked Up
        </Link>
        {/* Navigation Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Books Section Icon */}
              <Link to="/books" title="Book Lists">
                <BookmarkIcon
                  className={`h-6 w-6 ${isBooksSection ? 'text-bookAccent' : 'text-bookTan'}`}
                />
              </Link>
              {/* Short Stories Icon */}
              <Link to="/short-story" title="Short Story">
                <BookOpenIcon
                  className={`h-6 w-6 ${isShortStoryPage ? 'text-bookAccent' : 'text-bookTan'}`}
                />
              </Link>
              {/* Profile Icon */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="text-bookTan"
                title="Profile"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            </>
          ) : (
            <>
              {/* Profile Icon */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="text-bookTan"
                title="Profile"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
      </div>
      {isProfileOpen && (
        <ProfilePanel
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
          username={user?.name || null}
        />
      )}
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
