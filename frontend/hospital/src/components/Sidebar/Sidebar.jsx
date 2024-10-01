import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onLinkClick, userData }) => {
    // for logout functionality
    const navigate = useNavigate();  // initialize navigate

    const handleLogout = async () => {
        const token = localStorage.getItem('token')

        if (token) {
            // Extract only the actual token (removing the 'Token ' part)
            const tokenValue = token.split(' ')[1]; 
            try{
                const response = await fetch('http://127.0.0.1:8000/api/users/logout/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`
                        },
                        body: JSON.stringify({
                            token: tokenValue  // send token in request body
                        })
                    });
                if (response.ok){
                    localStorage.removeItem('token')
                    navigate('/')
                } else {
                    console.log('Logout failed')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // for image
    const profileImage = userData && userData.profile_photo ? userData.profile_photo : 'https://via.placeholder.com/150';


    return (
        <aside className="sidebar">
            {localStorage.getItem('token') ? (
                <>
                    {/* Display user details when logged in */}
                    <h3 className="name-tag">Hello, {userData.first_name} {userData.last_name}</h3>
                    <div className="profile-section">
                        <img src={profileImage} alt="Profile" className="profile-image" />
                    </div>
                    {/* Links */}
                    <ul>
                        <li onClick={() => onLinkClick('Home')}>Home</li>
                        <li onClick={() => onLinkClick('EditProfile')}>Profile</li>
                        <li onClick={() => onLinkClick('Departments')}>Departments</li>
                        {userData?.groups?.[0] === 2 && (
                            <li onClick={() => onLinkClick('MyRecords')}>My Records</li>
                        )}
                        {userData?.groups?.[0] === 1 && (
                            <>
                                <li onClick={() => onLinkClick('PatientRecords')}>Patient Records</li>
                                <li onClick={() => onLinkClick('AllPatients')}>All Patients</li>
                                <li onClick={() => onLinkClick('AllDoctors')}>All Doctors</li>
                            </>
                        )}
                    </ul>
                    {/* Logout button */}
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    {/* Show Hello, User when not logged in */}
                    <h3 className="name-tag">Hello, User</h3>
                    {/* Login button */}
                    <button className="login-button" onClick={() => navigate('/login')}>Login</button>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
