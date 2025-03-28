import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookmarkIcon, BookOpenIcon, UserIcon } from '@heroicons/react/24/solid';
import ProfilePanel from './ProfilePanel';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setIsLoggedIn, setUser } = useAuth();

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

  return (
    <header className="responsive-bg p-3">
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
      {isProfileOpen && (
        <ProfilePanel
          onClose={() => setIsProfileOpen(false)}
          onLogout={handleLogout}
          username={user?.name || null}
        />
      )}
    </header>
  );
};

export default Header;
