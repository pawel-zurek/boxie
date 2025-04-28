// src/components/SalesPipelineBoard.jsx
import React from 'react';
import PipelineColumn from './PipelineColumn';

function SalesPipelineBoard({ data, onDealClick }) {  // <-- Accept onDealClick as a prop
  return (
    <div className="sales-pipeline-board">
      {data.columns.map(column => (
        <PipelineColumn
          key={column.id}
          column={column}
          onDealClick={onDealClick}  // <-- Pass it down to PipelineColumn
        />
      ))}
    </div>
  );
}

export default SalesPipelineBoard;
