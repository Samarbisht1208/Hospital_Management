import React, { useState } from 'react';
import './PatientRecords.css';
import EditPatientRecord from '../EditPatientRecord./EditPatientRecord.';

const PatientRecords = ({ record_id, created_date, diagnostics, treatments, observations, department, patient_id, first_name, last_name, refreshPatientRecords, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  // Function to handle the DELETE request for deleting the patient record
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patient_records/${patient_id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (response.ok) {
          console.log('Record deleted successfully');
          refreshPatientRecords();  // Call this to refresh the records after deletion
          setIsEditing(false); // Close the edit form after deletion
        } else {
          console.log('Failed to delete record');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  return (
    <div>
      {/* Background blur effect when editing */}
      <div className={`record-card ${isEditing ? 'blur-background' : ''}`} onClick={() => setIsEditing(true)}>
        <h2>Patient: {first_name ? `${first_name} ${last_name}` : username}</h2>
        <h3 className='date'>Created Date: {new Date(created_date).toLocaleDateString()}</h3>
        <p className="diagnostics">Diagnostics: {diagnostics}</p>
        <p className="treatments">Treatments: {treatments}</p>
        <p className="observations">Observations: {observations}</p>
      </div>

      {/* Popup Modal for Editing */}
      {isEditing && (
        <div className="edit-modal">
          <h2 className='edit-modal-heading'>Edit Patient Record</h2>
          <EditPatientRecord
            diagnostics={diagnostics}
            treatments={treatments}
            observations={observations}
            patient_id={patient_id}
            refreshPatientRecords={refreshPatientRecords}
            toggleEdit={setIsEditing}
          />
          <div className="button-container">
            <button className="delete-button" onClick={() => setIsDeleteConfirmVisible(true)}>Delete Record</button>
            <button className="close-button" onClick={() => setIsEditing(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeleteConfirmVisible && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this record?</p>
          <div className="delete-confirm-buttons">
            <button className="confirm-button" onClick={handleDelete}>Sure</button>
            <button className="cancel-button" onClick={() => setIsDeleteConfirmVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
