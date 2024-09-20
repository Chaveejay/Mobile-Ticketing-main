import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/userlogin.css';

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/otp-verification');
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="form-section">
          <h2 className="title">Sign UP</h2>
          <input type="text" className="input" placeholder="First Name" />
          <input type="text" className="input" placeholder="Last Name" />
          <input type="text" className="input" placeholder="Phone Number" />
          <input type="password" className="input" placeholder="Password" />
          <input type="password" className="input" placeholder="Confirm Password" />
          <button className="button" onClick={handleNextClick}>Next</button>
        </div>
        <div className="info-section">
          <h2 className="title">User Sign UP</h2>
          <p>Already have an account?</p>
          <Link to="/" className="secondary-button">Sign IN</Link>
        </div>
      </div>
      <Link to="/user-types" className="back-button">Back to user Types</Link>
    </div>
  );
};

export default SignUpPage;
