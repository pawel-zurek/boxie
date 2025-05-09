// src/components/PersonPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PersonPage.css';
import EditPersonModal from './EditPersonModal';

const API_URL = import.meta.env.VITE_API_URL;

function PersonPage() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchPersonAndJobs = async () => {
      const token = localStorage.getItem("token");

      try {
        // Fetch person details
        const personResponse = await fetch(`${API_URL}/api/persons/${personId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!personResponse.ok) {
          throw new Error("Failed to fetch person");
        }

        const personData = await personResponse.json();
        setPerson(personData);

        // Fetch all jobs
        const jobsResponse = await fetch(`${API_URL}/api/jobs/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!jobsResponse.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const allJobs = await jobsResponse.json();

        // Filter jobs belonging to this person
        const filteredJobs = allJobs.filter(job => String(job.person_id) === String(personId));
        setJobs(filteredJobs);

      } catch (error) {
        console.error("Error fetching person or jobs:", error);
      }
    };

    fetchPersonAndJobs();
  }, [personId]);

  if (!person) return <div className="loading-state">Loading person info...</div>;

  return (
    <div className="person-page-container">
      <header className="page-header">
          <button className="back-to-dashboard-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="header-with-button">
            <h1>{person.name}</h1>
            <button className="edit-button" onClick={() => setIsEditModalOpen(true)}>
              Edit
            </button>
          </div>
        </header>

        {isEditModalOpen && (
          <EditPersonModal
            person={person}
            onClose={() => setIsEditModalOpen(false)}
            onSave={() => window.location.reload()}
          />
        )}

      <section className="person-info card">
        <h2>Contact Info</h2>
        <p><strong>Email:</strong> {person.email}</p>
        <p><strong>Phone:</strong> {person.phone_no}</p>
        <p><strong>Role:</strong> {person.role}</p>
        <p><strong>NIP:</strong> {person.nip}</p>
      </section>

      <section className="person-jobs card">
        <h2>Jobs for {person.name}</h2>
        {jobs.length > 0 ? (
          <ul className="job-list">
            {jobs.map(job => (
              <li key={job.id}>
                <button
                  className="link-button"
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  {job.name} — €{Number(job.value).toLocaleString()}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found for this person.</p>
        )}
      </section>
    </div>
  );
}

export default PersonPage;
