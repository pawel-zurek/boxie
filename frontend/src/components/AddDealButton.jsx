// src/components/AddDealButton.jsx
import React from 'react';
// import './AddDealButton.css';

function AddDealButton({ onClick }) {
  const handleClick = () => {
     console.log("AddDealButton clicked!"); // Log when the button's handler is called
     if (onClick) { // Make sure onClick prop exists before calling it
        onClick(); // Call the prop passed from Header/App
     }
  };

  return (
    // Attach the handleClick function to the button's onClick event
    <button className="add-deal-button" onClick={handleClick}>
      {/* Add a plus icon here later */}
      <span>Add Deal</span>
    </button>
  );
}

export default AddDealButton;