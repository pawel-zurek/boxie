// src/components/JobPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function JobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

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
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Job Details</h1>
      <p><strong>Title:</strong> {job.name}</p>
      <p><strong>Value:</strong> €{job.value ? Number(job.value).toLocaleString() : '0'}</p>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Close Date:</strong> {job.close_date ? new Date(job.close_date).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Address:</strong> {job.address}</p>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '2rem' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default JobPage;
