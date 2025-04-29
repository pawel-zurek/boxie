// src/components/JobPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import './JobPage.css';

const API_URL = import.meta.env.VITE_API_URL;

function JobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  // Placeholder data for sections not currently in your job object
  // You'll need to update your API to fetch this data
  const [notes, setNotes] = useState("Stunning luxury villa featuring 5 bedrooms and 4 bathrooms, spread across 4,500 sq ft of living space. The property includes a private pool, landscaped gardens, and state-of-the-art smart home features. Recently renovated with high-end finishes throughout.");
  const [contactInfo, setContactInfo] = useState({
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com"
  });
  const [stagesTimeline, setStagesTimeline] = useState([
      { name: "Leads", date: "Jan 15, 2025" },
      { name: "Contact mode", date: "Feb 1, 2025" },
      { name: "Proposal", date: "Feb 15, 2025" },
      // Add more stages here
  ]);

  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job");
        }

        const jobData = await response.json();
        console.log("Fetched job:", jobData);
        setJob(jobData);
        // You would ideally update notes, contactInfo, and stagesTimeline
        // here if your API returned that data.
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
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
            {/* Edit and Back Buttons (these are the local ones, keep if needed for section-specific actions) */}
            {/* If you only want the header back button, you can remove these local buttons */}
            <div className="deal-actions">
                {/* You'll likely need an onClick handler for the Edit button */}
                <button className="edit-button">Edit</button>
                 {/* The original local back button - remove if only using header back button */}
                {/* <button className="back-button" onClick={() => navigate('/dashboard')}>
                    Back
                </button> */}
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
            {/* Property Details Section */}
            <section className="property-details-section card">
              <h2>Property Details</h2>
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
              {/* Phone */}
              <div className="contact-item">
                 {/* <PhoneIcon className="contact-icon" />  Example icon */}
                 <span>{contactInfo.phone}</span> {/* Using placeholder phone */}
              </div>
              {/* Email */}
              <div className="contact-item">
                 {/* <MailIcon className="contact-icon" /> Example icon */}
                 <span>{contactInfo.email}</span> {/* Using placeholder email */}
              </div>
            </section>

            <section>
            <div className="contact-item">
                <span>Client:</span>
                <button
                    className="link-button"
                    onClick={() => navigate(`/person/${job.person_id}`)}
                >
                    View Person Details
                </button>
            </div>
            </section>

            {/* Stages Timeline Section */}
            <section className="stages-timeline-section card">
              <h2>Stages Timeline</h2>
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobPage;