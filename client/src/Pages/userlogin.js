import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/userlogin.css'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
  
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
  
      const contentType = response.headers.get('content-type');
      let data;
  
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
  
      console.log('Response data:', data);
  
      if (response.ok) {
        if (data.token) {
          // Check if the role is "User"
          if (data.role === 'User') {
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            // Navigate to the user profile page
            navigate('/home');
          } else {
            alert('Unauthorized access. Only users can log in.');
          }
        } else {
          alert('Invalid credentials. No token received.');
        }
      } else {
        if (typeof data === 'string') {
          if (data === "Phone doesn't exist") {
            alert('Invalid phone number');
          } else if (data === 'Invalid password') {
            alert('Invalid password');
          } else {
            alert('Invalid credentials');
          }
        } else if (typeof data === 'object' && data.message) {
          if (data.message === "Phone doesn't exist") {
            alert('Invalid phone number');
          } else if (data.message === 'Invalid password') {
            alert('Invalid password');
          } else {
            alert('Invalid credentials');
          }
        } else {
          alert('Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="container1">
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
          {errors.phone && <div className="error">{errors.phone}</div>}
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <div className="error">{errors.password}</div>}
          <a href="/forgetpw" className="link">Forgot Your Password?</a>
          <button className="button" onClick={handleLogin}>Sign IN</button>
        </div>
        <div className="info-section">
          <h2 className="title">User Login</h2>
          <p className="para">Don't have an account?</p>
          <Link to="/usersignup" className="secondary-button">Sign UP</Link>
        </div>
      </div>
      <Link to="/usertypes" className="back-button">Back to User Types</Link>
    </div>
  );
};

export default LoginPage;
