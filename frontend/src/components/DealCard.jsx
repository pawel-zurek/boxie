// src/components/DealCard.jsx
import React from 'react';
import Tag from './Tag';
import AvatarGroup from './AvatarGroup';
import { Draggable } from '@hello-pangea/dnd';

// Now DealCard also accepts onDealClick
function DealCard({ deal, index, onDealClick }) {  // <-- Accept onDealClick
  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="deal-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => onDealClick(deal.id)}   // <-- Add click handler here

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
  );
}

export default DealCard;