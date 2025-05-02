// src/components/Header.jsx
import React from 'react';
import AddDealButton from './AddDealButton';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import a CSS file for styling

function Header({ onAddDealClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">Your Jobs</div> {/* Logo */}
        <AddDealButton onClick={onAddDealClick} /> {/* Add button after logo */}
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-right">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
