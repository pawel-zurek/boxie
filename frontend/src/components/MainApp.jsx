// src/components/MainApp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainApp.css';
import Header from './Header';
import SalesPipelineBoard from './SalesPipelineBoard';
import { DragDropContext } from '@hello-pangea/dnd';
import AddDealModal from './AddDealModal';

const API_URL = import.meta.env.VITE_API_URL;

// Define the stages (columns)
const stages = ["Lead", "Backlog", "In Progress", "Waiting for Payment", "Closed"];

function MainApp() {
  const [pipelineData, setPipelineData] = useState({ columns: [] });
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/api/jobs/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const jobs = await response.json();
        console.log("Fetched jobs:", jobs);

        const columns = stages.map(stage => {
          const stageJobs = jobs.filter(job => job.status === stage);
          const deals = stageJobs.map(job => ({
            id: String(job.id),
            title: job.name,
            value: job.value ? Number(job.value) : 0, // Store the raw number for calculation
            formattedValue: job.value ? `€${Number(job.value).toLocaleString()}` : '€0', // Keep the formatted value for display
            tags: [],
            assignees: [],
            dueDate: job.close_date ? new Date(job.close_date).toLocaleDateString() : 'N/A',
            raw: job
          }));
          const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

          return {
            id: stage,
            title: stage,
            deals: deals,
            totalValue: `€${totalValue.toLocaleString()}`, // Format the total value
          };
        });

        setPipelineData({ columns });
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleDealClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newColumns = Array.from(pipelineData.columns);

    const sourceColIndex = newColumns.findIndex(col => col.id === source.droppableId);
    const destinationColIndex = newColumns.findIndex(col => col.id === destination.droppableId);

    if (sourceColIndex === -1 || destinationColIndex === -1) {
      console.error("Source or destination column not found");
      return;
    }

    const sourceColumn = { ...newColumns[sourceColIndex] };
    const destinationColumn = { ...newColumns[destinationColIndex] };

    sourceColumn.deals = Array.from(sourceColumn.deals);
    if (sourceColIndex !== destinationColIndex) {
      destinationColumn.deals = Array.from(destinationColumn.deals);
    }

    const [movedDeal] = sourceColumn.deals.splice(source.index, 1);
    destinationColumn.deals.splice(destination.index, 0, movedDeal);

    newColumns[sourceColIndex] = sourceColumn;
    newColumns[destinationColIndex] = destinationColumn;

    // Recalculate total values after drag and drop
    const updatedColumns = newColumns.map(column => ({
      ...column,
      totalValue: `€${column.deals.reduce((sum, deal) => sum + (deal.value || 0), 0).toLocaleString()}`,
    }));

    setPipelineData({ columns: updatedColumns });

    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/api/jobs/${movedDeal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });

      console.log("Updated job status successfully");
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("Failed to update job status. Please refresh page.");
    }
  };

  const toggleAddDealModal = () => {
    setIsAddDealModalOpen(!isAddDealModalOpen);
  };

  const handleSaveNewDeal = () => {
    toggleAddDealModal();
  };

  return (
    <div className="App">
      <Header onAddDealClick={toggleAddDealModal} />
      <DragDropContext onDragEnd={onDragEnd}>
        <SalesPipelineBoard data={pipelineData} onDealClick={handleDealClick} />
      </DragDropContext>
      {isAddDealModalOpen && (
        <AddDealModal
          onClose={toggleAddDealModal}
          onSave={handleSaveNewDeal}
        />
      )}
    </div>
  );
}

export default MainApp;
