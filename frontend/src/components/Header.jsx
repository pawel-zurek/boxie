// src/components/Header.jsx
import React from 'react';
import AddDealButton from './AddDealButton';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ onAddDealClick, onAddClientClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">Your Jobs</div>
        <AddDealButton onClick={onAddDealClick} />
        <button className="add-client-button" onClick={onAddClientClick}>
          Add Client
        </button>
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
