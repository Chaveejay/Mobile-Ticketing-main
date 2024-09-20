import { Link } from 'react-router-dom';
import logo from '../images/SLTLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const GuestNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-2 bg-white rounded">
      <div className="container-fluid">
        <Link to="/guestdashboard">
          <img className="mx-5" src={logo} alt='logo' width={170} height={65} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="d-flex ms-auto">
            <Link to="/usersignup">
              <button
                type="button"
                className="btn mx-2"
                style={{
                  backgroundColor: '#1827A4', // Primary button color
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0288D1'} // Hover color
                onMouseOut={(e) => e.target.style.backgroundColor = '#1827A4'}
              >
                Register
              </button>
            </Link>
            <Link to="/userlogin">
              <button
                type="button"
                className="btn mx-2"
                style={{
                  backgroundColor: '#1827A4', // Primary button color
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0288D1'} // Hover color
                onMouseOut={(e) => e.target.style.backgroundColor = '#1827A4'}
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default GuestNavbar;
