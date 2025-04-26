// src/components/DealCard.jsx
import React from 'react';
import Tag from './Tag';
import AvatarGroup from './AvatarGroup';
// *** Import Draggable ***
import { Draggable } from 'react-beautiful-dnd';
// import './DealCard.css'; // Your CSS file for deal cards

// DealCard component now receives 'index' prop from the mapping in PipelineColumn
function DealCard({ deal, index }) { // *** Accept the index prop ***
  return (
    // *** Wrap the main deal card div with Draggable ***
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        // Apply these props and ref to the element that serves as the draggable item
        <div
          className="deal-card"
          {...provided.draggableProps} // Props for the draggable element itself
          {...provided.dragHandleProps} // Props that designate *how* the user can drag the element (e.g., the entire card)
          ref={provided.innerRef} // Apply the innerRef
          // Optional: Add styling based on snapshot.isDragging
          // style={{
          //   ...provided.draggableProps.style,
          //   backgroundColor: snapshot.isDragging ? 'lightgreen' : 'undefined', // Or original color
          // }}
        >
          {/* Deal Header: Title and Value */}
          <div className="deal-header">
            <h4 className="deal-title">{deal.title}</h4>
            <div className="deal-value">{deal.value}</div>
          </div>

          {/* Tags */}
          <div className="deal-tags">
            {deal.tags && deal.tags.map(tagText => (
              <Tag key={tagText} text={tagText} color={tagText} />
            ))}
          </div>

          {/* Assignees and Due Date */}
          <div className="deal-footer">
            <div className="deal-assignees">
              {deal.assignees && deal.assignees.length > 0 ? (
                <AvatarGroup assignees={deal.assignees} />
              ) : (
                <span>No Assignees</span>
              )}
            </div>
            <div className="deal-due-date">Due {deal.dueDate}</div>
          </div>
        </div>
      )}
    </Draggable>
    // *** End Draggable ***
  );
}

export default DealCard;