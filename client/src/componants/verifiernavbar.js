import { Link, useLocation } from 'react-router-dom';
import logo from '../images/SLTLogo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const location = useLocation(); // Get the current path

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
            <li className="nav-item">
              <Link 
                to="/qr-scanner" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/mytickets' ? 'text-primary' : ''}`}
              >
                My Events
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/qr-scanner" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/qr-scanner' ? 'text-primary' : ''}`}
              >
                QR Scanner
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center ms-auto">
            <Link to="/usertypes" className='nav-link fs-5 fw-bold text-danger'>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
