import React from 'react';
import './UserDetails.css'; // Make sure to import the CSS file

const UserDetails = ({ userData }) => {
  return (
    <div className="user-details-card">
      <h2>{userData.first_name} {userData.last_name}</h2>
      <p>Email: {userData.email}</p>
      <p>Username: {userData.username}</p>
      <p>Department: {userData.department}</p>
      <p>Role: {userData.groups[0] === 1 ? 'Doctor' : 'Patient'}</p>
    </div>
  );
};

export default UserDetails;
