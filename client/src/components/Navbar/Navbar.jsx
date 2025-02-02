import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

function Navbar({ onLogoutClick }) {
  // 從 localStorage 獲取用戶資訊
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Brand/logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <span className="text-primary">Case</span>Management
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>

          {/* User section */}
          <div className="d-flex align-items-center">
            {user && (
              <span className="me-3 text-secondary">Welcome, {user.name}</span>
            )}
            <button
              onClick={onLogoutClick}
              className="btn btn-outline-primary"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
};

export default Navbar;
