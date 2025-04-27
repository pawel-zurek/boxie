// src/components/MainApp.jsx
import React, { useState, useEffect } from 'react';
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

  // Fetch jobs from backend when MainApp loads
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

        // Organize jobs into columns based on status
        const columns = stages.map(stage => ({
          id: stage,
          title: stage,
          deals: jobs
            .filter(job => job.status === stage)
            .map(job => ({
              id: String(job.id),
              title: job.name,
              value: job.value ? `€${Number(job.value).toLocaleString()}` : '€0',
              tags: [],
              assignees: [],
              dueDate: job.close_date ? new Date(job.close_date).toLocaleDateString() : 'N/A',
              raw: job // Store full job data if needed later
            })),
        }));

        setPipelineData({ columns });
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

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

    setPipelineData({ columns: newColumns });

    // 🔥 Send PATCH request to update status
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
    // After a new deal is added, ideally re-fetch jobs from backend
    // or optimistically update state if you want later
    toggleAddDealModal();
  };

  return (
    <div className="App">
      <Header onAddDealClick={toggleAddDealModal} />
      <DragDropContext onDragEnd={onDragEnd}>
        <SalesPipelineBoard data={pipelineData} />
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