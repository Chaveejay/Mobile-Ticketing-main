import React from 'react';
import { Link } from 'react-router-dom';
import '../css/userlogin.css';

const LoginPage = () => {
  return (
    <div className="container">
      <div className="login-container">
        <div className="form-section">
          <h2 className="title">Sign IN</h2>
          <input type="text" className="input" placeholder="Phone Number" />
          <input type="password" className="input" placeholder="Password" />
          <a href="#" className="link">Forgot Your Password</a>
          <button className="button">Sign IN</button>
        </div>
        <div className="info-section">
          <h2 className="title">User Sign IN</h2>
          <p>Don't have an account?</p>
          <Link to="/signup" className="secondary-button">Sign UP</Link>
        </div>
      </div>
      <Link to="/user-types" className="back-button">Back to user Types</Link>
    </div>
  );
};

export default LoginPage;
