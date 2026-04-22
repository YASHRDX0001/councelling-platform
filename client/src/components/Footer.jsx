import { GraduationCap, Code, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <GraduationCap size={24} />
              <span>Campus<span className="text-gradient">Connect</span></span>
            </Link>
            <p className="footer-desc">
              Connecting students with college mentors for informed decisions about higher education.
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/colleges">Browse Colleges</Link>
            <Link to="/signup">Sign Up</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="mailto:support@campusconnect.com">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter"><MessageCircle size={18} /></a>
            <a href="#" aria-label="GitHub"><Code size={18} /></a>
            <a href="mailto:support@campusconnect.com" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
