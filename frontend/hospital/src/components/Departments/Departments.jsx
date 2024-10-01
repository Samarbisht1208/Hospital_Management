import React from 'react'
import './Departments.css'

const Departments = ({ departmentName, diagnostics, specialization, location, id}) => {
    return(
        <div className="department-card">
            <h2>{departmentName}</h2>
            <h3>Diagnostics: {diagnostics}</h3>
            <p className='specialization'>Specialization: {specialization}</p>
            <p className='location'>{location}</p>
        </div>
    )
}

export default Departments