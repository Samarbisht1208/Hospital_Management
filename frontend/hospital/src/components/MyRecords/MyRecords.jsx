import { useState, useEffect } from 'react'
import './MyRecords.css'

const MyRecords = ({ userData }) => {
    const [myPatientRecord, setMyPatientRecord] = useState(null)

    useEffect(() => {
        const gettingMyRecord = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/patient_records/${userData.id}/`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                    })
                if (response.ok) {
                    const data = await response.json()
                    setMyPatientRecord(data)
                    console.log(data)
                } else {
                    console.log('Failed to fetch patient records details')
                }
            } catch (error) {
                console.log('Error:', error)
            }
        }
        gettingMyRecord()
    }, [])

    return (
        <div className='body-container'>
            <div className="records-container">
                {myPatientRecord ? (
                    <div className="record-card">
                        <div className="record-header">
                            <h2>Patient Record</h2>
                            <span className="record-date">
                                {new Date(myPatientRecord.created_date).toLocaleDateString()} {new Date(myPatientRecord.created_date).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="record-content">
                            <h2 className='department-name'>{userData.department}</h2>
                            <p className='diagnostics'><strong>Diagnostics:</strong> {myPatientRecord.diagnostics}</p>
                            <p className='treatments'><strong>Treatments:</strong> {myPatientRecord.treatments}</p>
                            <p className='observations'><strong>Observations:</strong> {myPatientRecord.observations}</p>
                            {myPatientRecord.misc && <p><strong>Misc:</strong> {myPatientRecord.misc}</p>}
                        </div>
                    </div>
                ) : (
                    <p>Loading your record...</p>
                )}
            </div>
        </div>
    )
}

export default MyRecords