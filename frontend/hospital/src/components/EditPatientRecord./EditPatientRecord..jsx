import React, { useState } from 'react';
import './EditPatientRecord.css';

const EditPatientRecord = ({ diagnostics, treatments, observations, patient_id, refreshPatientRecords, toggleEdit }) => {
    const [updatedDiagnostics, setUpdatedDiagnostics] = useState(diagnostics);
    const [updatedTreatments, setUpdatedTreatments] = useState(treatments);
    const [updatedObservations, setUpdatedObservations] = useState(observations);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/patient_records/${patient_id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    },
                    body: JSON.stringify({
                        diagnostics: updatedDiagnostics,
                        treatments: updatedTreatments,
                        observations: updatedObservations,
                    }),
                });

                if (response.ok) {
                    console.log('Record updated successfully');
                    refreshPatientRecords();
                    toggleEdit(false);
                } else {
                    console.log('Failed to update record');
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }
    };

    return (
        <div className="edit-record-container">
            <label className="highlight-label">Diagnostics:</label>
            <textarea
                value={updatedDiagnostics}
                onChange={(e) => setUpdatedDiagnostics(e.target.value)}
                className="diagnostics"
                placeholder="Enter diagnostics..."
            />
            <label className="highlight-label">Treatments:</label>
            <textarea
                value={updatedTreatments}
                onChange={(e) => setUpdatedTreatments(e.target.value)}
                className="treatments"
                placeholder="Enter treatments..."
            />
            <label className="highlight-label">Observations:</label>
            <textarea
                value={updatedObservations}
                onChange={(e) => setUpdatedObservations(e.target.value)}
                className="observations"
                placeholder="Enter observations..."
            />
            <button onClick={handleUpdate}>Save Changes</button>
        </div>
    );
};

export default EditPatientRecord;
