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
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [person, setPerson] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showActivityInput, setShowActivityInput] = useState(false);
  const [newActivityText, setNewActivityText] = useState('');


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

useEffect(() => {
  if (!jobId) return;

  const fetchNotesAndActivities = async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch Notes
      const notesResponse = await fetch(`${API_URL}/api/notes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!notesResponse.ok) throw new Error("Failed to fetch notes");
      const allNotes = await notesResponse.json();
      const jobNotes = allNotes.filter(note => note.job_id === Number(jobId));
      setNotes(jobNotes);

      // Fetch Activities
      const activitiesResponse = await fetch(`${API_URL}/api/activities/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!activitiesResponse.ok) throw new Error("Failed to fetch activities");
      const allActivities = await activitiesResponse.json();
      const jobActivities = allActivities.filter(a => a.job_id === Number(jobId));
      setActivities(jobActivities);

    } catch (err) {
      console.error("Error fetching notes or activities:", err);
    }
  };

  fetchNotesAndActivities();
}, [jobId]);

const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this job?");
  if (!confirmed) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      navigate("/dashboard");
    } else {
      const text = await response.text();
      console.error("Delete failed:", response.status, text);
      alert("There was an error deleting the job.");
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("There was an error deleting the job.");
  }
};

const toggleActivityStatus = async (activityId, currentStatus) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/api/activities/${activityId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: !currentStatus }),
    });

    if (!response.ok) throw new Error("Failed to update activity");

    // Update local state after successful patch
    setActivities(prev =>
      prev.map(act =>
        act.id === activityId ? { ...act, status: !currentStatus } : act
      )
    );
  } catch (err) {
    console.error("Error updating activity status:", err);
  }
};

const handleAddNote = async () => {
  if (!newNoteText.trim()) return;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/api/notes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: newNoteText,
        job_id: parseInt(jobId),
      }),
    });

    if (!response.ok) throw new Error("Failed to add note");
    setNewNoteText('');
    setShowNoteInput(false);
    // Refresh notes
    const data = await response.json();
    setNotes(prev => [...prev, data]);
  } catch (err) {
    console.error("Error adding note:", err);
  }
};

const handleAddActivity = async () => {
  if (!newActivityText.trim()) return;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/api/activities/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        desc: newActivityText,
        job_id: parseInt(jobId),
        status: false,
      }),
    });

    if (!response.ok) throw new Error("Failed to add activity");
    setNewActivityText('');
    setShowActivityInput(false);
    // Refresh activities
    const data = await response.json();
    setActivities(prev => [...prev, data]);
  } catch (err) {
    console.error("Error adding activity:", err);
  }
};

const handleDeleteNote = async (noteId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete note");
    setNotes(prev => prev.filter(n => n.id !== noteId));
  } catch (err) {
    console.error("Error deleting note:", err);
  }
};

const handleDeleteActivity = async (activityId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/api/activities/${activityId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete activity");
    setActivities(prev => prev.filter(a => a.id !== activityId));
  } catch (err) {
    console.error("Error deleting activity:", err);
  }
};

  if (!job) {
    return <div className="loading-state">Loading...</div>;
  }


  return (
    <div className="job-page-container">
      {/* Header */}
      <header className="page-header">
        {/* Updated Header Left: Back to Dashboard Button */}
        <div className="header-left-button"> {/* Use a class for styling */}
            <button className="back-to-dashboard-button" onClick={() => navigate('/dashboard')}>
                {/* Add an icon here if you like, e.g., <ArrowLeftIcon className="icon" /> */}
                ← Back to Dashboard
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
          <div className="deal-actions">
              <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>Edit</button>
              <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>
        </div>
        </div>

        <div className="detail-sections-container">
          <div className="left-column">
            <div className="add-buttons-row">
              <button className="add-button" onClick={() => setShowNoteInput(prev => !prev)}>+ Add Note</button>
              <button className="add-button" onClick={() => setShowActivityInput(prev => !prev)}>+ Add Activity</button>
            </div>

            {/* Notes Section */}
            <section className="notes-section card">
              <h2>Notes</h2>
              {showNoteInput && (
                <div className="input-area">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter note text"
                  />
                  <button onClick={handleAddNote}>Save</button>
                </div>
              )}
              {notes.length === 0 ? (
                <p>No notes available.</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="note-box">
                    <p>{note.text}</p>
                    <button className="delete-button-small" onClick={() => handleDeleteNote(note.id)}>Delete</button>
                  </div>
                ))
              )}
            </section>

            {/* Activities Section */}
            <section className="activities-section card">
              <h2>Activities</h2>
              {showActivityInput && (
                <div className="input-area">
                  <input
                    type="text"
                    value={newActivityText}
                    onChange={(e) => setNewActivityText(e.target.value)}
                    placeholder="Enter activity description"
                  />
                  <button onClick={handleAddActivity}>Save</button>
                </div>
              )}
              {activities.length === 0 ? (
                <p>No activities available.</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="activity-box">
                    <div className="activity-item">
                      <input
                        type="checkbox"
                        checked={activity.status}
                        onChange={() => toggleActivityStatus(activity.id, activity.status)}
                      />
                      <span>{activity.desc}</span>
                      <button className="delete-button-small" onClick={() => handleDeleteActivity(activity.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
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