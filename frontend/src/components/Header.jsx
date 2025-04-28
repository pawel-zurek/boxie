// src/components/Header.jsx
import React from 'react';
import AddDealButton from './AddDealButton';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

// Make sure Header accepts onAddDealClick as a prop
function Header({ onAddDealClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');   // Remove token from localStorage
    navigate('/');                      // Navigate to login
    window.location.reload();            // Force reload to reset auth state
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div>Main screen</div>
        <h1>Your Jobs</h1>
        <AddDealButton onClick={onAddDealClick} />
      </div>

      <div className="header-actions">
        <SearchBar />
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>

      </div>
    </header>
  );
}

export default Header;
