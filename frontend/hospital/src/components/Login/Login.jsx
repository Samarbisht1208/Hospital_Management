import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css'

const Login = () => {
    // initializing state
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate(); // to redirect after successful login


    // handling submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        // data, which we want to send to  backend
        const loginData = {
            username: username,
            password: password
        }

        //sending data
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/login/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                })
            // after getting the response, ccosoling the tokken
            if (response.ok){
                const data = await response.json();
                localStorage.setItem('token',data.token)
                console.log(data.token)
                navigate('/app');
            } else {
                const data = await response.json();
                console.log('Login failed');
                alert(data.error)
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className='assume-it-is-body'>
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <label>Username</label>
                        </div>
                        <div className="input-box">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <label>Password</label>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <Link to={'/register'}>Register Here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
