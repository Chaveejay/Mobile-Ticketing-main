import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/Organizer.css';

const OrganizerSignInPage = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignIn = async () => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        alert(data || 'Login failed');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data); // Debugging log

      // Check if the user's role is 'Organizer'
      if (data.role && data.role.toLowerCase() === 'organizer') {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        // Navigate to the organizer profile page
        navigate('/event-organizer-dashboard');
      } else {
        alert('Unauthorized access. Only organizers can log in.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="form-section">
          <h2 className="title">Sign IN</h2>
          <input
            type="text"
            className="input"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {/* <a href="#" className="link">Forgot Your Password</a> */}
          <button className="button" onClick={handleSignIn}>Sign IN</button>
        </div>
        <div className="info-section">
          <h2 className="title">Event Organizer Sign In</h2>
          <p>Don't have an account?</p>
          <Link to="/event-organizer-signup" className="secondary-button">Sign UP</Link>
        </div>
      </div>
      <Link to="/usertypes" className="back-button">Back to User Types</Link>
    </div>
  );
};

export default OrganizerSignInPage;
