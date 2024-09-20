import { Link } from 'react-router-dom';
import logo from '../images/SLTLogo.png';
import man from '../images/man.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm p-2 bg-white rounded">
      <div className="container-fluid">
        <Link to="/">
          <img className="mx-5" src={logo} alt='logo' width={170} height={65} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item mx-4">
              <Link to="/home" className='nav-link fs-5 fw-bold'>Home</Link>
            </li>

            <li className="nav-item mx-4">
              <Link to="/events" className='nav-link fs-5 fw-bold'>Events</Link>
            </li>

            <li className="nav-item mx-4">
              <Link to="/categories" className='nav-link fs-5 fw-bold'>Categories</Link>
            </li>

            <li className="nav-item mx-4">
              <Link to="/mytickets" className='nav-link fs-5 fw-bold' >My Tickets</Link>
            </li>

          </ul>
          <div className="d-flex ms-auto">
            {/* <Link to="/">
              <button type="button" className="btn btn-home mx-1" style={{ fontWeight: 'bold' }}>Register</button>
            </Link>
            <Link to="/">
          <button type="button" className="btn btn-custom">Sign In</button></Link> */}
            <Link to="/userprofile">
              <img className="mx-5" src={man} alt='man' width={35} height={35} />
            </Link> 
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;