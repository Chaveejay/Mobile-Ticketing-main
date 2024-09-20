import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/SLTAdminLogin.css'; // Adjust the path as needed

const SLTAdminLoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        phone,
        password
      });

      // Store token in local storage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('role', response.data.role);

      // Redirect based on role (Assuming admin role is 'Admin')
      if (response.data.role === 'Admin') {
        navigate('/admin-live-events');
      } else {
        setError('Unauthorized: Only admins can log in here.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="slt-admin-container">
      <div className="slt-admin-login-container">
        <h2 className="slt-admin-title">Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="slt-admin-input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            className="slt-admin-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="slt-admin-button">Sign In</button>
        </form>
      </div>
      <Link to="/" className="slt-admin-back-button">Back to User Types</Link>
    </div>
  );
};

export default SLTAdminLoginPage;
