// src/components/Header.jsx
import React from 'react';
import AddDealButton from './AddDealButton';
import SearchBar from './SearchBar';
import UserDropdown from './UserDropdown';

// Make sure Header accepts onAddDealClick as a prop
function Header({ onAddDealClick }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div>Main screen</div>
        <h1>Sales Pipeline</h1>
        {/* Pass the received onAddDealClick prop down as onClick to AddDealButton */}
        <AddDealButton onClick={onAddDealClick} />
      </div>

      <div className="header-actions">
        <SearchBar />
        <UserDropdown />
      </div>
    </header>
  );
}

export default Header;