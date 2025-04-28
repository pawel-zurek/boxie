// src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_URL}/api/jobs/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const jobsData = await response.json();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length === 0) {
      setFilteredJobs([]);
      return;
    }

    const matches = jobs.filter(job =>
      job.name && job.name.toLowerCase().includes(term)
    );
    setFilteredJobs(matches);
  };

  const handleSelectJob = (jobId) => {
    setSearchTerm('');
    setFilteredJobs([]);
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="search-bar-container" style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search deals..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
        style={{
            color: '#333',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px 12px',
            borderRadius: '4px',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box'
        }}
      />
      {filteredJobs.length > 0 && (
        <div
          className="search-suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderTop: 'none',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 10
          }}
        >
          {filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => handleSelectJob(job.id)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                color: '#333',
                backgroundColor: '#fff',
              }}
            >
              {job.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
