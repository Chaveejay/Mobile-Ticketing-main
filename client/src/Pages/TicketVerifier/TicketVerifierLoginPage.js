import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/TicketVerifier.css'; 

const TicketVerifierLoginPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/qr-scanner');
  };

  return (
    <div className="ticket-verifier-container">
      <div className="ticket-verifier-login-container">
        <h2 className="ticket-verifier-title">Ticket Verifier Login</h2>
        <input type="text" className="ticket-verifier-input" placeholder="Telephone" />
        <input type="text" className="ticket-verifier-input" placeholder="OTP" />
        <button className="ticket-verifier-button" onClick={handleSignIn}>Sign IN</button>
      </div>
      <Link to="/" className="ticket-verifier-back-button">Back to user Types</Link>
    </div>
  );
};

export default TicketVerifierLoginPage;

