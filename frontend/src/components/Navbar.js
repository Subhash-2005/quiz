import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            QuizPlatform
          </Link>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/create-quiz" className="hover:underline">
                  Create Quiz
                </Link>
                <Link to="/join-quiz" className="hover:underline">
                  Join Quiz
                </Link>
                <Link to="/profile" className="hover:underline">
                  Profile
                </Link>
                {currentUser.isAdmin && (
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <span>Hello, {currentUser.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;