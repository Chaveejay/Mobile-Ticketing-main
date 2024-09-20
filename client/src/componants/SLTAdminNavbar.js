import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/SLTLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const SLTAdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        navigate('/slt-admin-login'); // Redirect to login if no token
        return;
      }

      const response = await fetch('http://localhost:5000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Clear token from local storage
        alert('Logout successful');
        navigate('/slt-admin-login'); // Redirect to login page
      } else {
        alert('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-2 bg-white rounded">
      <div className="container-fluid">
        <Link to="/">
          <img className="me-3" src={logo} alt='logo' width={170} height={65} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-3">
              <Link to="/admin-live-events" className={`nav-link fs-5 fw-bold ${location.pathname === '/admin-live-events' ? 'text-primary' : ''}`}>
                Live Event
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="/edit-subscription" className={`nav-link fs-5 fw-bold ${location.pathname === '/edit-subscription' ? 'text-primary' : ''}`}>
                Edit Subscription
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="/admin-event-requests" className={`nav-link fs-5 fw-bold ${location.pathname === '/admin-event-requests' ? 'text-primary' : ''}`}>
                Event Requests 
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="/admin-dashboard" className={`nav-link fs-5 fw-bold ${location.pathname === '/admin-dashboard' ? 'text-primary' : ''}`}>
                Platform Activity
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center ms-auto">
            <button onClick={handleLogout} className='nav-link fs-5 fw-bold text-danger' style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SLTAdminNavbar;
