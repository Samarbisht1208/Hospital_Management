import { Link, useNavigate } from "react-router-dom";
import './Register.css'
import { useState } from "react";

const Register = () => {

  // initilizing the state
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [group, setGroup] = useState('');
  const navigate = useNavigate();

  // sending the data to backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple validation for password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Prepare the data to send to backend
    const registrationData = {
      email: email,
      username: username,
      password: password,
      department: department,
      group: group
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData)
        }
      )

      // after getting the response
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        alert(JSON.stringify(data.status))
        navigate('/login')
      } else {
        const errorData = await response.json();
        console.log('Registration failed:', errorData);
        alert(JSON.stringify(errorData));
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }



  return (
    <div className="assume-it-is-register-body">
      <div className="register-container">
        <div className="register-box">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            {/* email */}
            <div className="input-box">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label>Email</label>
            </div>
            {/* username */}
            <div className="input-box">
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label>Username</label>
            </div>
            {/* password */}
            <div className="input-box">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label>Password</label>
            </div>
            {/* confirm password */}
            <div className="input-box">
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <label>Confirm Password</label>
            </div>
            {/* department */}
            <div className="input-box">
              <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="" disabled selected></option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Pediatrics">Oncology</option>
              </select>
              <label className="select-label">Department</label>
            </div>
            {/* groups */}
            <div className="input-box">
              <select value={group} onChange={(e) => setGroup(e.target.value)} required>
                <option value="" disabled selected></option>
                <option value="Doctors">Doctors</option>
                <option value="Patients">Patients</option>
              </select>
              <label className="select-label">Group</label>
            </div>
            <button type="submit">Register</button>
          </form>
          <p>Already have an account? <Link to={'/login'}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};



export default Register;
