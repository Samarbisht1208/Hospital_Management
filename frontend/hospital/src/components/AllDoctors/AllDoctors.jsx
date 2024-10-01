import { useState, useEffect } from "react";
import './AllDoctors.css'

const AllDoctors = () => {
    // initializing the state
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        const fetchingDoctors = async () => {
            const token = localStorage.getItem('token')
            if (token){
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/doctors/', 
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    })

                    if (response.ok) {
                        const data = await response.json()
                        setDoctors(data)
                    } else {
                        console.log('Failed to fetch Doctors List')
                    }
                } catch (error) {
                    console.log('Error:', error)
                }
            }
        }
        fetchingDoctors()
    }, [])

    return (
        <div className="doctor-list">
            {doctors.map((doctor) => {
                // Set a default placeholder if profile photo is empty
                const profileImage = doctor.profile_photo ? doctor.profile_photo : 'https://via.placeholder.com/150';

                return (
                    <div key={doctor.id} className="doctor-card">
                        <img src={profileImage} alt={`${doctor.username}'s profile`} />
                        <p className="doctor-id">ID: {doctor.id}</p>
                        <p className="doctor-name">
                            {doctor.name.trim() ? doctor.name : doctor.username}
                        </p>
                        <p className="doctor-department">Department: {doctor.department}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default AllDoctors