// src/components/AvatarGroup.jsx
import React from 'react';
import './AvatarGroup.css';

function AvatarGroup({ assignees }) {
  return (
    <div className="avatar-group">
      {assignees && assignees.map((assigneeId, index) => (
        <img
          key={assigneeId || index}
          // *** UPDATE THE SRC PATH HERE ***
          src={`/avatars/${assigneeId}`} // <-- This assumes filenames in public/avatars match assigneeId strings
          alt={`Assignee ${index + 1}`}
          className="avatar-icon"
          style={{ zIndex: assignees.length - index }}
        />
      ))}
    </div>
  );
}

export default AvatarGroup;