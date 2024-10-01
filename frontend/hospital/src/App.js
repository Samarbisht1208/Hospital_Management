import React, { useState, useEffect } from 'react';
import './App.css'
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import Content from './components/Content/Content';

const App = () => {
  // for changing the links
  const [selectedContent, setSelectedContent] = useState('Home');

  const handleLinkClick = (link) => {
    setSelectedContent(link);
  };

  // for storing the initial data
  const [userData, setUserData] = useState(null)

  // fetching the initial data
  const fetchUserData = async () => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/all_details/',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${token}`
            }
          });
        if (response.ok) {
          const data = await response.json()
          setUserData(data);
        } else {
          console.log('Failed to fetch user details')
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('No token found')
    }
  };

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div className="app-container">
      <Header group={userData ? userData.groups : null} />
      <div className="main-content">
        <Sidebar onLinkClick={handleLinkClick} userData={userData || {}} />
        <Content selectedContent={selectedContent} userData={userData} refreshUserData={fetchUserData}/>
      </div>
    </div>
  );
}

export default App