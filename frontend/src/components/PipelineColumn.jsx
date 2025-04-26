// src/components/PipelineColumn.jsx
import React from 'react';
import DealCard from './DealCard';
// *** Import Droppable ***
import { Droppable } from '@hello-pangea/dnd';
// import './PipelineColumn.css';

function PipelineColumn({ column }) {
  return (
    <div className="pipeline-column">
      {/* Column Header */}
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="deal-count">{column.deals.length}</span>
      </div>

      {/* *** Wrap the deal cards container with Droppable *** */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          // Apply these props and ref to the element that serves as the droppable area
          <div
            className="deal-cards-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
            // Optional: style={{ backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'transparent' }}
          >
            {/* Map over the deals array and render DealCard components */}
            {/* Pass the index prop! */}
            {column.deals.map((deal, index) => (
              <DealCard
                key={deal.id}
                deal={deal}
                index={index} // *** Pass the index prop ***
              />
            ))}
            {/* *** MUST render the placeholder *** */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* *** End Droppable *** */}
    </div>
  );
}

export default PipelineColumn;