import React from "react";
import './Home.css'; 
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1 className="title">Welcome to Hospital Management System</h1>
            <img src='https://www.xibms.com/blog/wp-content/uploads/2020/03/hospital-management.jpg' alt="My Image" className="home-page-image"/>
            <div className="button-container">
                <a href="http://127.0.0.1:8000/admin/" className="button" target="_blank" rel="noopener noreferrer">
                    Admin
                </a>
                <button className="button" onClick={() => navigate('/login')}>Login</button>
                <button className="button" onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
}

export default Home;
