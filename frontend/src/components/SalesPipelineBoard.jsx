// src/components/SalesPipelineBoard.jsx
import React from 'react';
// Import the PipelineColumn component
import PipelineColumn from './PipelineColumn';
// You might create a separate CSS file later, but for now styles are in App.css
// import './SalesPipelineBoard.css';

// SalesPipelineBoard component receives 'data' as a prop from App.jsx
function SalesPipelineBoard({ data }) {
  return (
    // Apply the class name for styling (styles are in App.css from Step 12d)
    <div className="sales-pipeline-board">
      {/*
        Map over the 'columns' array found within the 'data' prop.
        For each 'column' object in the array, render a 'PipelineColumn' component.
      */}
      {data.columns.map(column => (
        // Pass necessary props to the PipelineColumn component:
        // - key: A unique identifier for each item in a list (React requires this).
        //        We use column.id as it's unique for each column.
        // - column: Pass the entire column object down to the PipelineColumn so it has access
        //           to the column title and the deals within that column.
        <PipelineColumn
          key={column.id}
          column={column}
          // You will pass setPipelineData and other handlers here later
        />
      ))}
    </div>
  );
}

export default SalesPipelineBoard;