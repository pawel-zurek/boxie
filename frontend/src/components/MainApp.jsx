// src/App.jsx
import React, { useState } from 'react'; // Import useState
import './MainApp.css'; // Import the App.css file for styling

// Import the components used in App
import Header from './header';
import SalesPipelineBoard from './SalesPipelineBoard';
import { DragDropContext } from '@hello-pangea/dnd'; // Import DragDropContext
import AddDealModal from './AddDealModal'; // Import the AddDealModal component

// *** MOCK DATA - This holds the initial state of your pipeline ***
const MOCK_PIPELINE_DATA = {
  columns: [
    {
      id: 'leads',
      title: 'Leads',
      deals: [
        { id: 'deal-1', title: 'Website Redesign', value: '$12,000', tags: ['Design', 'Development'], assignees: ['avatar1.jpg', 'avatar2.jpg'], dueDate: 'Apr 30' },
        { id: 'deal-2', title: 'Mobile App Dev', value: '$24,000', tags: ['Mobile'], assignees: ['avatar3.jpg'], dueDate: 'May 15' },
      ]
    },
    {
      id: 'backlog',
      title: 'Backlog',
      deals: [
        { id: 'deal-3', title: 'SEO Campaign', value: '$8,000', tags: ['Marketing'], assignees: ['avatar1.jpg', 'avatar3.jpg'], dueDate: 'May 20' },
      ]
    },
    {
      id: 'live',
      title: 'Live',
      deals: [
        { id: 'deal-4', title: 'Content Strategy', value: '$5,500', tags: ['Content'], assignees: ['avatar2.jpg'], dueDate: 'May 25' },
      ]
    },
    {
      id: 'payment',
      title: 'Payment',
      deals: [
        { id: 'deal-5', title: 'Brand Identity', value: '$15,000', tags: ['Branding'], assignees: ['avatar1.jpg', 'avatar3.jpg'], dueDate: 'Jun 5' },
      ]
    },
    // Add a 'Won' column placeholder if you like based on the mockup's last column
    // {
    //   id: 'won',
    //   title: 'Won',
    //   deals: [
    //      { id: 'deal-6', title: 'E-commerce Platform', value: '$45,000', tags: ['E-commerce', 'Development'], assignees: ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg'], dueDate: 'Completed' },
    //   ]
    // }
  ]
};
// *** END MOCK DATA ***

// *** Helper function to generate a unique ID for new deals ***
// This is important for react-beautiful-dnd keys and potentially backend IDs
const generateUniqueId = () => `deal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
// *** End helper function ***


function App() {
  // State for the pipeline data - the source of truth for the board
  const [pipelineData, setPipelineData] = useState(MOCK_PIPELINE_DATA);
  // State to control the visibility of the Add Deal modal
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);

  // *** The onDragEnd function handles drop events and updates state (Revised version) ***
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // 1. If the item was dropped outside any droppable area, do nothing.
    if (!destination) {
      console.log('Dropped outside');
      return;
    }

    // 2. If the item was dropped in the exact same spot it started, do nothing.
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
       console.log('Dropped in the same spot');
      return;
    }

    // --- Logic to update the state using explicit immutability ---

    // Create a NEW array of columns from the current state
    const newColumns = Array.from(pipelineData.columns);

    // Find the index of the source and destination columns in the new array
    const sourceColIndex = newColumns.findIndex(col => col.id === source.droppableId);
    // Corrected: Use newColumns.findIndex directly, not newColumns.columns
    const destinationColIndex = newColumns.findIndex(col => col.id === destination.droppableId);

     if (sourceColIndex === -1 || destinationColIndex === -1) {
        console.error("Error: Source or destination column not found during drag end.");
        return; // Exit if columns aren't found
    }

    // Create NEW copies of the source and destination column objects
    const sourceColumn = { ...newColumns[sourceColIndex] };
    const destinationColumn = { ...newColumns[destinationColIndex] };

    // Create NEW arrays of deals within the cloned columns
    sourceColumn.deals = Array.from(sourceColumn.deals);
    // Only clone destination deals if it's a different column, otherwise they are the same array reference
    if (sourceColIndex !== destinationColIndex) {
      destinationColumn.deals = Array.from(destinationColumn.deals);
    }


    // 3. Remove the dragged deal from the source column's deals array clone.
    // splice(startIndex, deleteCount) removes elements and returns an array of removed elements.
    const [draggedDeal] = sourceColumn.deals.splice(source.index, 1);
     console.log(`Removed deal ${draggableId} from column ${source.droppableId} at index ${source.index}`);


    // 4. Insert the dragged deal into the destination column's deals array clone.
    // splice(startIndex, deleteCount, item1) adds elements.
    destinationColumn.deals.splice(destination.index, 0, draggedDeal);
    console.log(`Inserted deal ${draggableId} into column ${destination.droppableId} at index ${destination.index}`);

    // 5. Place the modified source and destination column clones back into the newColumns array
    newColumns[sourceColIndex] = sourceColumn;
    if (sourceColIndex !== destinationColIndex) { // Only update destination if it's a different column
       newColumns[destinationColIndex] = destinationColumn;
    }


    // 6. Update the state with the completely new array of columns
    setPipelineData({ columns: newColumns });

    console.log("State updated. New pipelineData:", { columns: newColumns });
  };
  // *** End onDragEnd function ***

  // *** Function to toggle modal state (open/close) ***
  const toggleAddDealModal = () => {
    console.log("Toggling modal visibility. Current state:", isAddDealModalOpen); // Debug log
    setIsAddDealModalOpen(!isAddDealModalOpen);
    console.log("Modal state after toggle:", !isAddDealModalOpen); // Debug log
  };
  // *** End toggle function ***

  // *** Function to handle saving a new deal from the modal and adding it to state ***
  // This function receives the data collected from the modal form (mapped to backend spec format)
  const handleSaveNewDeal = (newDealData) => {
      console.log("Received data for new deal from modal:", newDealData); // Debug log

      // 1. Create a new deal object for the UI, adding necessary UI-specific fields
      //    and ensuring it has a unique ID for react-beautiful-dnd keys.
      const dealForUI = {
          id: generateUniqueId(), // Generate a unique ID for the frontend
          title: newDealData.name || 'New Deal', // Use the name from the form as the deal title
          // Format the value if it exists, otherwise default
          value: newDealData.value ? `$${Number(newDealData.value).toLocaleString()}` : '$0',
          tags: [], // Initialize with empty tags (add tag input to modal later if needed)
          assignees: [], // Assign assignees later
          dueDate: newDealData.close_date ? new Date(newDealData.close_date).toLocaleDateString() : 'N/A', // Use close_date as due date (format it)
          // Include other data from the backend spec
          ...newDealData
          // Note: Fields like phoneNumber, emailAddress, typeOfJob, notes, attachments
          // from the modal form are NOT automatically included here unless you add them
          // to the backendData object being passed from the modal.
      };


      // 2. Find the index of the 'leads' column in the current state data.
      //    New deals typically go into the first column.
      const leadsColIndex = pipelineData.columns.findIndex(col => col.id === 'leads');

      // Safety check: Ensure the 'leads' column exists
      if (leadsColIndex === -1) {
          console.error("Leads column not found in pipelineData!");
          // Handle this error appropriately in a real app
          return;
      }

      // 3. Create a mutable copy of the pipeline data to modify it
      //    Using JSON.parse(JSON.stringify()) is a simple way for deep cloning mock data.
      //    For real applications with complex state, consider libraries like Immer.
      const newPipelineData = JSON.parse(JSON.stringify(pipelineData));

      // 4. Add the new deal object to the deals array of the 'leads' column in the copied data.
      newPipelineData.columns[leadsColIndex].deals.push(dealForUI);

      // 5. Update the state with the new pipeline data.
      setPipelineData(newPipelineData);

      console.log("New deal successfully added to Leads column state:", dealForUI); // Debug log

      // 6. Close the modal after the deal is added to the state.
      toggleAddDealModal();

      // 7. TODO: Here is where you would typically send the newDealData (or the full dealForUI)
      //    to your backend API to save it persistently.
      //    Example using fetch API:
      // fetch('/api/deals', { // Replace with your actual backend endpoint
      //    method: 'POST',
      //    headers: { 'Content-Type': 'application/json' },
      //    body: JSON.stringify(newDealData) // Send the data formatted for the backend
      // })
      // .then(response => {
      //    if (!response.ok) {
      //        throw new Error(`HTTP error! status: ${response.status}`);
      //    }
      //    return response.json(); // Or response.text() if backend doesn't return JSON
      // })
      // .then(backendResponseData => {
      //    console.log('Deal successfully saved to backend:', backendResponseData);
      //    // Optionally update state again if the backend returns the final deal object
      // })
      // .catch(error => {
      //    console.error('Error saving deal to backend:', error);
      //    // TODO: Handle this error gracefully (e.g., show a notification to the user)
      //    // You might want to remove the deal from the frontend state if saving failed
      // });
  };
  // *** End handleSaveNewDeal function ***


  return (
    // The main container div for your application
    // Styles for .App are in App.css
    <div className="App">
      {/* Render the Header component and pass the modal toggle function */}
      <Header onAddDealClick={toggleAddDealModal} />

      {/* Wrap the main draggable area with DragDropContext */}
      {/* Pass the onDragEnd function to handle drop events */}
      <DragDropContext onDragEnd={onDragEnd}>
         {/* Render the SalesPipelineBoard component and pass the data */}
        <SalesPipelineBoard data={pipelineData} /> {/* setPipelineData no longer needed directly by board */}
      </DragDropContext>

      {/* *** Render the AddDealModal component conditionally based on state *** */}
      {/* It will only render when isAddDealModalOpen is true */}
      {/* Pass the toggle function as onClose so the modal can close itself */}
      {/* Pass the handleSaveNewDeal function as onSave */}
      {isAddDealModalOpen && (
        <AddDealModal
           onClose={toggleAddDealModal} // Function to call when modal should close
           onSave={handleSaveNewDeal} // Function to call when "Save Lead" is clicked
        />
      )}
      {/* *** End Modal Rendering *** */}
    </div>
  );
}

export default App;