import React from 'react';
import '../css/usertypes.css'; 
import logo from '../images/Mobitel.svg';
import userIcon from '../images/user-icon.png';
import eventPlanner from '../images/event-planner.png';
import adminIcon from '../images/admin.png';
import ticketIcon from '../images/ticket.png';
import { useNavigate } from 'react-router-dom';

const Usertypes = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate('/userlogin');
  };

  const handleEventCreatorSignUp = () => {
    navigate('/organizer-signin');
  };

  const handleSLTAdminLogin = () => {
    navigate('/slt-admin-login');
  };

  const handleTicketVerifierLogin = () => {
    navigate('/ticket-verifier-login');
  };

  const handleGuestLogin = () => {
    navigate('/guesthome');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Logo" className="App-logo" />
      </header>
      <main>
        <h2>Select your user type...</h2>
        <div className="user-options">
          <button className="user-button" onClick={handleUserLogin}>
            <div className="icon-container">
              <img src={userIcon} alt="User Icon" className="button-icon" />
            </div>
            User
          </button>
          
          <button className="user-button" onClick={handleEventCreatorSignUp}>
            <div className="icon-container">
              <img src={eventPlanner} alt="Event Planner Icon" className="button-icon" />
            </div>
            Event Creator
          </button>
          
          <button className="user-button" onClick={handleSLTAdminLogin}>
            <div className="icon-container">
              <img src={adminIcon} alt="Admin Icon" className="button-icon" />
            </div>
            SLT Admin
          </button>
          
          <button className="user-button" onClick={handleTicketVerifierLogin}>
            <div className="icon-container">
              <img src={ticketIcon} alt="Ticket Verifier Icon" className="button-icon" />
            </div>
            Ticket Verifier
          </button>
        </div>
        <button className="guest-button" onClick={handleGuestLogin}>
          <div className="icon-container">
            <img src={userIcon} alt="Guest Icon" className="button-icon" />
          </div>
          Login as Guest User
        </button>
      </main>
    </div>
  );
}

export default Usertypes;
