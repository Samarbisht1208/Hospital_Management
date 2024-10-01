import { useState, useEffect } from "react";
import './AllPatients.css';

const AllPatients = () => {
    // initializing state
    const [patientList, setPatientList] = useState([])

    // getting patient data
    useEffect(() => {
        const fetchingPatientList = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/patients/',
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        })
                    if (response.ok) {
                        const data = await response.json()
                        setPatientList(data)
                    } else {
                        console.log('Failed to fetch patients list')
                    }
                } catch (error) {
                    console.log("Error:", error)
                }
            }
        }
        fetchingPatientList()
    }, [])

    return (
        <div className="patient-list">
            {patientList.map((patient) => {
                // Set a default placeholder if profile photo is empty
                const profileImage = patient.profile_photo ? patient.profile_photo : 'https://via.placeholder.com/150';

                return (
                    <div key={patient.id} className="patient-card">
                        <img src={profileImage} alt={`${patient.username}'s profile`} />
                        <p className="patient-id">ID: {patient.id}</p>
                        <p className="patient-name">
                            {patient.name.trim() ? patient.name : patient.username}
                        </p>
                        <p className="patient-department">Department: {patient.department}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default AllPatients