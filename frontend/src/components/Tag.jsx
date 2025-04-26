// src/components/Tag.jsx
import React from 'react';
import './Tag.css'; // We'll create this CSS file next

// The Tag component receives 'text' and optionally a 'color' prop
function Tag({ text, color }) {
  // You could use the 'color' prop to dynamically apply different CSS classes
  // or inline styles. For simplicity now, we'll just apply a generic class.
  return (
    <span className={`tag tag-${color}`}> {/* Add a class based on color */}
      {text}
    </span>
  );
}

export default Tag;