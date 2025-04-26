// src/components/SearchBar.jsx
import React from 'react';
// import './SearchBar.css'; // Optional: dedicated CSS file

function SearchBar() {
  return (
    <div className="search-bar-container">
      {/* Add a search icon here later */}
      <input
        type="text"
        placeholder="Search deals..."
        className="search-input" // Use the class defined in App.css
      />
    </div>
  );
}

export default SearchBar;