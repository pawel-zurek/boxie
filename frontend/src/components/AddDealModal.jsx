import React, { useState, useEffect } from 'react';
import './AddDealModal.css';

const API_URL = import.meta.env.VITE_API_URL;

function AddDealModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    value: '',
    status: '',
    close_day: '1',
    close_month: '1',
    close_year: '2025',
    person_id: '',
  });
  const [persons, setPersons] = useState([]);
  const [loadingPersons, setLoadingPersons] = useState(true);

  useEffect(() => {
    const fetchPersons = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/api/persons/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch persons");

        const data = await response.json();
        setPersons(data);
      } catch (error) {
        console.error("Error loading persons:", error);
      } finally {
        setLoadingPersons(false);
      }
    };

    fetchPersons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLead = async () => {
    if (!formData.name || !formData.person_id) {
      alert('Job Name and Client selection are required.');
      return;
    }

    const closeDate = `${formData.close_year}-${String(formData.close_month).padStart(2, '0')}-${String(formData.close_day).padStart(2, '0')}T00:00:00`;

    const backendData = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      value: parseInt(formData.value) || 0,
      close_date: closeDate,
      status: formData.status || 'Lead',
      person_id: parseInt(formData.person_id),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      onClose();
    } catch (error) {
      console.error('Error saving the job:', error);
      alert('There was an error saving the job. Please try again.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Job Information</h2>
        </div>

        <div className="modal-body">
          {/* Job Name */}
          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="name">Job Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter job name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Address and City */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Value, Status and Person Dropdown */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="value">Value (€)</label>
              <input
                type="number"
                id="value"
                name="value"
                placeholder="Enter job value"
                value={formData.value}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select status</option>
                <option value="Lead">Lead</option>
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for Payment">Waiting for Payment</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="person_id">Client</label>
              {loadingPersons ? (
                <p>Loading clients...</p>
              ) : persons.length === 0 ? (
                <p style={{ color: 'red' }}>Please add a client first!</p>
              ) : (
                <select
                  id="person_id"
                  name="person_id"
                  value={formData.person_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a client</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} — {person.email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Close Date */}
          <div className="form-row">
            <div className="form-field">
              <label>Close Date - Day</label>
              <select name="close_day" value={formData.close_day} onChange={handleInputChange}>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Close Date - Month</label>
              <select name="close_month" value={formData.close_month} onChange={handleInputChange}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Close Date - Year</label>
              <select name="close_year" value={formData.close_year} onChange={handleInputChange}>
                {['2024', '2025', '2026'].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button type="button" className="save-lead-button" onClick={handleSaveLead}>
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDealModal;
