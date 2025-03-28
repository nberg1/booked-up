import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface ProfilePanelProps {
  onClose: () => void;
  onLogout: () => void;
  username: string | null;  // Now explicitly allow null.
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onClose, onLogout, username }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-64 bg-bookBeige text-bookBrown shadow-lg z-50 flex flex-col p-4">
        <button
          className="self-end mb-2 text-bookBrown hover:text-bookAccent"
          onClick={onClose}
          title="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col gap-2">
          {username ? (
            <>
              <p className="font-bold">{username}</p>
              <Link to="/profile" className="py-2 hover:bg-bookTan/50 rounded px-2" onClick={onClose}>
                Profile
              </Link>
              <Link to="/account" className="py-2 hover:bg-bookTan/50 rounded px-2" onClick={onClose}>
                Account Settings
              </Link>
              <button
                onClick={onLogout}
                className="text-left py-2 hover:bg-bookTan/50 rounded px-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 hover:bg-bookTan/50 rounded px-2" onClick={onClose}>
                Login
              </Link>
              <Link to="/signup" className="py-2 hover:bg-bookTan/50 rounded px-2" onClick={onClose}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;