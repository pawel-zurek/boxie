import React, { useState } from 'react'; // Import useState for component state
import './AddDealModal.css'; // Import the CSS file for modal styling

// The AddDealModal component receives props from App.jsx
// onClose: A function to call when the modal should close
// onSave: A function to call when the "Save Lead" button is clicked (will pass form data)
function AddDealModal({ onClose, onSave }) {
  // State to hold the form data as the user types
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    typeOfJob: '',
    notes: '',
  });

  // Handler function to update the formData state whenever an input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the input's name and current value
    setFormData((prevFormData) => ({
      ...prevFormData, // Copy the previous form data
      [name]: value, // Update the value for the specific input field by its name
    }));
  };

  // Handler function called when the "Save Lead" button is clicked
  const handleSaveLead = () => {
    // Basic validation for required fields
    if (!formData.fullName || !formData.emailAddress) {
      alert('Full Name and Email Address are required.');
      return;
    }

    // *** Map form data to backend specification ***
  const backendData = {
    name: formData.fullName, // Map fullName to name
    address: formData.address, // Map address to address
    // *** Handle fields missing from the current form mockup: ***
    city: 'Unknown', // Placeholder: Add a city field to the form or derive/default this
    value: 0,        // Placeholder: Add a value field to the form or default this
    close_date: new Date().toISOString(), // Placeholder: Add a date picker or default this
    status: 'leads', // Default status to 'leads' as it's a new lead
    person_id: 0,    // Placeholder: Add a way to select/assign a person, or default this
    // Note: Phone Number, Email, Type of Job, Notes, Attachments from the form
    // are NOT included in the provided backend spec. You might need to add these
    // to the backend spec or handle them differently if they are needed.
    // For now, only include what the backend spec requires.
  };
  // *** End mapping ***

  console.log("Data formatted for backend:", backendData);

  // Call the onSave prop passed from App.jsx and pass the backendData
  if (onSave) { // Check if onSave prop was provided
    onSave(backendData);
  }


    // Close the modal
    onClose();
  };

  // Handler to close the modal when clicking the overlay
  const handleOverlayClick = (e) => {
    // Only close if the click was directly on the overlay, not the modal content
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    // This is the main modal overlay background div
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* This is the modal content box that appears in the center */}
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>New Lead Information</h2>
        </div>

        {/* Modal Body: Contains the form fields */}
        <div className="modal-body">
          {/* Form Row 1: Full Name and Address */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Form Row 2: Phone Number and Type of Job */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="typeOfJob">Type of Job</label>
              <input
                type="text"
                id="typeOfJob"
                name="typeOfJob"
                placeholder="Select job type"
                value={formData.typeOfJob}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Form Row 3: Email Address (Full Width) */}
          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="emailAddress">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                placeholder="Enter email address"
                value={formData.emailAddress}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Form Row 4: Notes (Full Width, Textarea) */}
          <div className="form-row">
            <div className="form-field full-width">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Enter any additional notes or requirements"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>

          {/* Attachments section placeholder */}
          <div className="form-section">
            <h4>Attachments</h4>
            <div className="attachment-area">
              <p>Drag and drop files here or</p>
              <button type="button">Browse Files</button>
              <p>Maximum file size: 10MB</p>
            </div>
          </div>
        </div>

        {/* Modal Footer: Contains the action buttons */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button type="button" className="save-lead-button" onClick={handleSaveLead}>
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDealModal;