// src/components/JobPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import './JobPage.css';
import EditDealModal from './EditDealModal';

const API_URL = import.meta.env.VITE_API_URL;

function JobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [stagesTimeline, setStagesTimeline] = useState([]);
  const [notes, setNotes] = useState("This is a note placeholder");
  const [person, setPerson] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
  const fetchJobAndStatusHistory = async () => {
    const token = localStorage.getItem("token");

    try {
      // 1. Fetch the job
      const jobResponse = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!jobResponse.ok) throw new Error("Failed to fetch job");
      const jobData = await jobResponse.json();
      setJob(jobData);

      const personResponse = await fetch(`${API_URL}/api/persons/${jobData.person_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (personResponse.ok) {
          const personData = await personResponse.json();
          setPerson(personData);
        } else {
          console.warn("Failed to fetch person data");
        }

      // 2. Fetch the status history
      const historyResponse = await fetch(`${API_URL}/jobs/${jobId}/status-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!historyResponse.ok) throw new Error("Failed to fetch status history");

      const historyData = await historyResponse.json();
      console.log("Status history:", historyData); // 🔍 Log result

      // Sort and transform
      const formattedTimeline = historyData
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(entry => ({
          name: entry.status,
          date: new Date(entry.timestamp).toLocaleDateString(),
        }));

      console.log("Formatted timeline:", formattedTimeline); // 🔍 Log mapped result

      setStagesTimeline(formattedTimeline);
    } catch (error) {
      console.error("Error loading job or stage history:", error);
      setStagesTimeline([]); // Fallback to empty
    }
  };

  fetchJobAndStatusHistory();
}, [jobId]);

  if (!job) {
    return <div className="loading-state">Loading...</div>;
  }

  // Helper function to determine status pill class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Waiting for Payment': // Use the exact status string from your data
        return 'status-waiting';
      case 'Closed Won':
        return 'status-closed-won';
      case 'Closed Lost':
          return 'status-closed-lost';
      // Add more cases for different statuses
      default:
        return 'status-default';
    }
  };

  return (
    <div className="job-page-container">
      {/* Header */}
      <header className="page-header">
        {/* Updated Header Left: Back to Dashboard Button */}
        <div className="header-left-button"> {/* Use a class for styling */}
            <button className="back-to-dashboard-button" onClick={() => navigate('/dashboard')}>
                {/* Add an icon here if you like, e.g., <ArrowLeftIcon className="icon" /> */}
                Back to Dashboard
            </button>
        </div>

        <div className="header-right">
            <SearchBar />
        </div>
      </header>

      {/* Main content area */}
      <div className="job-detail-content">
        {/* Deal Summary Section (Title, Status, Close Date, Edit/Back Buttons) */}
        <div className="deal-summary-section">
          <div className="deal-title">{job.name}</div>
          <div className="deal-header-row">
          <div className="deal-status-info">
            <span className={`status-pill ${getStatusClass(job.status)}`}>
              {job.status}
            </span>
            {job.close_date && (
              <span className="close-date-pill">
                Close Date: {new Date(job.close_date).toLocaleDateString()}
              </span>
            )}
          </div>
          <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>Edit</button>
        </div>
        </div>

        {/* Sections Container (Left and Right Columns) */}
        <div className="detail-sections-container">
          {/* Left Column */}
          <div className="left-column">
            {/* Notes Section */}
            <section className="notes-section card">
              <h2>Notes</h2>
              <p>{notes}</p> {/* Using placeholder notes */}
            </section>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Job Details Section */}
            <section className="property-details-section card">
              <h2>Job Details</h2>
              <div className="detail-item">
                <span className="detail-label">Value</span>
                <span className="detail-value">€{job.value ? Number(job.value).toLocaleString() : '0'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{job.address}</span>
              </div>
              {/* City - Placeholder */}
              <div className="detail-item">
                <span className="detail-label">City</span>
                <span className="detail-value">{job.city}</span> {/* Placeholder City */}
              </div>
            </section>

            {/* Contact Information Section */}
            <section className="contact-info-section card">
              <h2>Contact Information</h2>

              {person ? (
                <>
                  <div className="contact-item">
                    <span>{person.email}</span>
                  </div>
                  <div className="contact-item">
                    <span>{person.phone_no}</span>
                  </div>
                  <div className="contact-item">
                    <button
                      className="link-button"
                      onClick={() => navigate(`/person/${person.id}`)}
                    >
                      View Person Details
                    </button>
                  </div>
                </>
              ) : (
                <div className="contact-item">
                  <em>Loading contact info...</em>
                </div>
              )}
            </section>

            {/* Stages Timeline Section */}
            <section className="stages-timeline-section card">
              <h2>Stages Timeline</h2>

              {stagesTimeline.length === 0 ? (
                <p className="no-history">No stage history available.</p>
              ) : (
                <ul className="timeline-list">
                  {stagesTimeline.map((stage, index) => (
                    <li key={index} className="timeline-item">
                      <span className="timeline-dot"></span>
                      <div className="timeline-content">
                        <span className="stage-name">{stage.name}</span>
                        <span className="stage-date">{stage.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

          </div>
        </div>
      </div>
      {isEditModalOpen && (
              <EditDealModal
                job={job}
                onClose={() => setIsEditModalOpen(false)}
                onSave={() => window.location.reload()} // or a smarter update
              />
            )}
    </div>
  );
}

export default JobPage;