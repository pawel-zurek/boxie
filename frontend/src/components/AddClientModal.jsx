// src/components/AddClientModal.jsx
import React, { useState } from 'react';
import './AddDealModal.css'; // Reuse same styling

const API_URL = import.meta.env.VITE_API_URL;

function AddClientModal({ onClose, onClientAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    nip: '',
    email: '',
    phone_no: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveClient = async () => {
    if (!formData.name || !formData.nip) {
      alert('Name and NIP are required.');
      return;
    }

    const backendData = {
      ...formData,
      nip: parseInt(formData.nip),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/persons/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Client added:', result);
      if (onClientAdded) onClientAdded();
      onClose();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('There was an error adding the client.');
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
          <h2>New Client</h2>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="nip">NIP</label>
              <input
                type="number"
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone_no">Phone Number</label>
              <input
                type="text"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button type="button" className="save-lead-button" onClick={handleSaveClient}>
            Save Client
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddClientModal;
