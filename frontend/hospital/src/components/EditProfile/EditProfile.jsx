import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css'

const EditProfile = ({ userData, refreshUserData  }) => {
    // storing the formData
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        profile_photo: ''
    });

    // Load user data into form
    useEffect(() => {
        if (userData) {
            setFormData({
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                profile_photo: userData.profile_photo
            });
        }
    }, [userData]);

    // changing the data while changing input field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // on submitting the form
    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        // url to fetch
        const apiURL = userData.groups[0] === 1
            ? `http://127.0.0.1:8000/api/doctors/${userData.id}/`
            : `http://127.0.0.1:8000/api/patients/${userData.id}/`

        // now fetching the data
        try {
            const response = await fetch(apiURL,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(formData),
                })
            // after getting the response
            if (response.ok){
                await refreshUserData(); // Fetch updated user data
            } else {
                console.log('Failed to update profile');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    // Handle account deletion

    // State to manage delete confirmation visibility
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const navigate = useNavigate(); 

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        const apiURL = userData.groups[0] === 1
            ? `http://127.0.0.1:8000/api/doctors/${userData.id}/`
            : `http://127.0.0.1:8000/api/patients/${userData.id}/`;

        try {
            const response = await fetch(apiURL, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`
                },
            });
            if (response.ok) {
                console.log('Account deleted');
                localStorage.removeItem('token')
                navigate('/')
                // You can redirect or log out the user here after deletion
            } else {
                console.log('Failed to delete account');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {/* Apply blur class when the delete modal is open */}
            <div className={`edit-profile ${showDeleteConfirm ? 'blur-background' : ''}`}>
                <div className="edit-profile-header">
                    <h2>Edit Profile</h2>
                    <button className="delete-account-btn" onClick={() => setShowDeleteConfirm(true)}>
                        Delete Account
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Profile Photo URL:</label>
                        <input
                            type="text"
                            name="profile_photo"
                            value={formData.profile_photo}
                            onChange={handleChange}
                        />
                    </div>
                    <button className="save-button" type="submit">Save Changes</button>
                </form>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="delete-confirm-modal">
                    <p className='question'>Are you sure you want to delete your account?</p>
                    <button onClick={handleDeleteAccount}>Yes</button>
                    <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                </div>
            )}
        </div>
    )
}

export default EditProfile