// src/components/PipelineColumn.jsx
import React from 'react';
import DealCard from './DealCard';
import { Droppable } from '@hello-pangea/dnd';

function PipelineColumn({ column, onDealClick }) {
  return (
    <div className="pipeline-column">
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="deal-count">{column.deals.length}</span>
        {column.totalValue && (
          <div className="total-value">
            Total: {column.totalValue}
          </div>
        )}
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className="deal-cards-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {column.deals.map((deal, index) => (
              <DealCard
                key={deal.id}
                deal={deal}
                index={index}
                onDealClick={onDealClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default PipelineColumn;
