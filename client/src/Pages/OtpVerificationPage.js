import React from 'react';
import { Link } from 'react-router-dom';
import '../css/userlogin.css'; 

const OtpVerificationPage = () => {
  return (
    <div className="container">
      <div className="otp-container">
        <h2 className="title">OTP Verification</h2>
        <p>We have sent the verification code to your phone number</p>
        <div className="otp-inputs">
          <input type="text" maxLength="1" className="otp-input" />
          <input type="text" maxLength="1" className="otp-input" />
          <input type="text" maxLength="1" className="otp-input" />
          <input type="text" maxLength="1" className="otp-input" />
        </div>
        <Link to="/userlogin">
        <button className="secondary-button">
          Verify OTP
          </button>
        </Link>
        <p>
        If you didn’t receive a code !! 
        {/* <a href="#" className="link">Resend</a> */}
        </p>
      </div>
    </div>
  );
};

export default OtpVerificationPage;