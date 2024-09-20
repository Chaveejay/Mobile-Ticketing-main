import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/usersignup.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async () => {
    const phoneRegex = /^[0-9]{10}$/;
  
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          password: formData.password,
          role: 'User',
        }),
      });
  
      if (!response.ok) {
        const data = await response.text(); 
        if (response.status === 400 && data === 'Phone already exists') {
          alert('This phone number is already registered. Please use a different number.');
        } else {
          alert(data || 'Registration failed');
        }
        return;
      }
  
      const data = await response.json();
      navigate('/otp-verification');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  

  return (
    <div className="container1">
      <div className="login-container">
        <div className="form-section">
          <h2 className="title">Sign UP</h2>
          <input
            type="text"
            className="input"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="input"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
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
          <input
            type="password"
            className="input"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <button className="button" onClick={handleSignUp}>Next</button>
        </div>
        <div className="info-section">
          <h2 className="title">User Sign UP</h2>
          <p className="para">Already have an account?</p>
          <Link to="/userlogin" className="secondary-button">Sign IN</Link>
        </div>
      </div>
      <Link to="/usertypes" className="back-button">Back to user Types</Link>
    </div>
  );
};

export default SignUpPage;
