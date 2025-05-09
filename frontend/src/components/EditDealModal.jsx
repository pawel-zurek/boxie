import React, { useEffect, useState } from 'react';
import './AddDealModal.css'; // Reuse styling

const API_URL = import.meta.env.VITE_API_URL;

function EditDealModal({ job, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: job.name || '',
    address: job.address || '',
    city: job.city || '',
    value: job.value || '',
    status: job.status || '',
    close_day: new Date(job.close_date).getDate().toString(),
    close_month: (new Date(job.close_date).getMonth() + 1).toString(),
    close_year: new Date(job.close_date).getFullYear().toString(),
    person_id: job.person_id ? String(job.person_id) : '',
  });

  const [persons, setPersons] = useState([]);
  const [loadingPersons, setLoadingPersons] = useState(true);

  useEffect(() => {
    const fetchPersons = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/api/persons/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch persons");
        const data = await response.json();
        setPersons(data);
      } catch (err) {
        console.error("Error loading persons:", err);
      } finally {
        setLoadingPersons(false);
      }
    };
    fetchPersons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const closeDate = `${formData.close_year}-${String(formData.close_month).padStart(2, '0')}-${String(formData.close_day).padStart(2, '0')}T00:00:00`;

    const backendData = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      value: parseInt(formData.value) || 0,
      status: formData.status,
      close_date: closeDate,
      person_id: formData.person_id ? parseInt(formData.person_id) : null,
    };

    console.log("PATCH payload:", backendData);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) throw new Error("Failed to update job");
      await response.json();
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("There was an error updating the job.");
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
          <h2>Edit Job</h2>
        </div>

        <div className="modal-body">
          {/* Name */}
          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="name">Job Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
          </div>

          {/* Address + City */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="address">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="form-field">
              <label htmlFor="city">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
            </div>
          </div>

          {/* Value, Status, Client Dropdown */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="value">Value (€)</label>
              <input type="number" name="value" value={formData.value} onChange={handleInputChange} />
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
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
                <p>Please add a client first!</p>
              ) : (
                <select
                  name="person_id"
                  value={formData.person_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a client</option>
                  {persons.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Close date */}
          <div className="form-row">
            <div className="form-field">
              <label>Close Day</label>
              <select name="close_day" value={formData.close_day} onChange={handleInputChange}>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Close Month</label>
              <select name="close_month" value={formData.close_month} onChange={handleInputChange}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Close Year</label>
              <select name="close_year" value={formData.close_year} onChange={handleInputChange}>
                {['2024', '2025', '2026'].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-lead-button" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default EditDealModal;
