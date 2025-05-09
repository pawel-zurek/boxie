// src/components/EditPersonModal.jsx
import React, { useState } from 'react';
import './AddDealModal.css';

const API_URL = import.meta.env.VITE_API_URL;

function EditPersonModal({ person, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: person.name || '',
    email: person.email || '',
    phone_no: person.phone_no || '',
    role: person.role || '',
    nip: person.nip || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/persons/${person.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone_no: formData.phone_no,
          role: formData.role,
          nip: parseInt(formData.nip) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update person");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating person:", error);
      alert("Could not save changes.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Client Information</h2>
        </div>
        <div className="modal-body">
          {["name", "email", "phone_no", "role", "nip"].map(field => (
            <div className="form-row" key={field}>
              <div className="form-field full-width">
                <label htmlFor={field}>{field.replace("_", " ").toUpperCase()}</label>
                <input
                  type={field === "nip" ? "number" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button onClick={handleSave} className="save-lead-button">Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditPersonModal;
