import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Menu, X, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <div className="navbar-logo">
            <GraduationCap size={28} />
          </div>
          <span className="navbar-title">Campus<span className="text-gradient">Connect</span></span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/colleges" className="nav-link" onClick={() => setMobileOpen(false)}>
            Colleges
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link nav-link-admin" onClick={() => setMobileOpen(false)}>
                  <Shield size={16} />
                  Admin
                </Link>
              )}
              <div className="nav-divider" />
              <Link to="/profile" className="nav-link" onClick={() => setMobileOpen(false)}>
                <div className="nav-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                {user.name?.split(' ')[0]}
              </Link>
              <button className="btn btn-ghost nav-logout" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>
                Log In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
