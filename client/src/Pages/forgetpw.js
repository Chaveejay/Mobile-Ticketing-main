import React from 'react';
import '../css/forgetpw.css';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate('/userotp');
  };
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 >Forget Password</h2>
        <p class="paragraph">Enter your mobile number used for<br/> previous account creation</p>
        <input
          type="text"
          placeholder="Phone Number"
          className="phone-number-input"
        />
        <button className="next-button" onClick={handleNextClick}>Next</button>
      </div>
      <Link to="/userlogin" className="back-button">Back </Link>
    </div>
    
  );
}

export default ForgotPassword;
