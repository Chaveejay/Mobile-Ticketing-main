import { Link, useLocation } from 'react-router-dom';
import logo from '../images/SLTLogo.png';
import man from '../images/man.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const Navbar = () => {
  const location = useLocation(); // Get the current path

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-2 bg-white rounded">
      <div className="container-fluid">
        <Link to="/">
          <img className="mx-3" src={logo} alt='logo' width={170} height={65} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-3">
              <Link 
                to="/event-organizer-dashboard" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/event-organizer-dashboard' ? 'text-primary' : ''}`}
                style={{ color: location.pathname === '/event-organizer-dashboard' ? '#1827A4' : '' }}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link 
                to="/event-organizer-myevents" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/event-organizer-myevents' ? 'text-primary' : ''}`}
                style={{ color: location.pathname === '/event-organizer-myevents' ? '#1827A4' : '' }}
              >
                Live Events
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link 
                to="/create-event" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/create-event' ? 'text-primary' : ''}`}
                style={{ color: location.pathname === '/create-event' ? '#1827A4' : '' }}
              >
                Create Event
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/event-organizer-notification" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/event-organizer-notification' ? 'text-primary' : ''}`}
                style={{ color: location.pathname === '/event-organizer-notification' ? '#1827A4' : '' }}
              >
                Notification
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link 
                to="/subscriptions" 
                className={`nav-link fs-5 fw-bold ${location.pathname === '/subscriptions' ? 'text-primary' : ''}`}
                style={{ color: location.pathname === '/subscriptions' ? '#1827A4' : '' }}
              >
                Subscriptions
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center ms-auto">
            <Link to="/organizerprofile">
              <img className="mx-3" src={man} alt='man' width={35} height={35} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;