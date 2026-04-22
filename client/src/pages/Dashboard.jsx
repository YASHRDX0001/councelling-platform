import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, ArrowRight } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isMentor } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-welcome animate-fade-in">
          <div className="dashboard-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name?.charAt(0)?.toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="page-title">
              Welcome back, <span className="text-gradient">{user.name?.split(' ')[0]}</span>
            </h1>
            <p className="page-subtitle">
              {user.role === 'admin'
                ? 'Manage colleges and mentor applications from the admin panel.'
                : isMentor
                ? "You're helping students make better choices. Thank you!"
                : 'Explore colleges, connect with mentors, and find your perfect fit.'}
            </p>
          </div>
        </div>

        <div className="dashboard-cards stagger-children">
          <Link to="/colleges" className="dashboard-card card">
            <div className="dashboard-card-icon">
              <BookOpen size={24} />
            </div>
            <div className="dashboard-card-content">
              <h3>Explore Colleges</h3>
              <p>Browse our curated list of colleges and find detailed information about each one.</p>
            </div>
            <ArrowRight size={20} className="dashboard-card-arrow" />
          </Link>

          <Link to="/become-mentor" className="dashboard-card card">
            <div className="dashboard-card-icon dashboard-card-icon-2">
              <Users size={24} />
            </div>
            <div className="dashboard-card-content">
              <h3>{isMentor ? 'My Mentor Profile' : 'Become a Mentor'}</h3>
              <p>
                {isMentor
                  ? 'View your mentor applications and manage your profile.'
                  : 'Share your college experience and guide other students.'}
              </p>
            </div>
            <ArrowRight size={20} className="dashboard-card-arrow" />
          </Link>

          <Link to="/profile" className="dashboard-card card">
            <div className="dashboard-card-icon dashboard-card-icon-3">
              <GraduationCap size={24} />
            </div>
            <div className="dashboard-card-content">
              <h3>Your Profile</h3>
              <p>Update your name, bio, contact info and avatar to help mentors and students connect.</p>
            </div>
            <ArrowRight size={20} className="dashboard-card-arrow" />
          </Link>

          {user.role === 'admin' && (
            <Link to="/admin" className="dashboard-card card dashboard-card-admin">
              <div className="dashboard-card-icon dashboard-card-icon-admin">
                <GraduationCap size={24} />
              </div>
              <div className="dashboard-card-content">
                <h3>Admin Dashboard</h3>
                <p>Add, edit, or delete colleges. Review and manage mentor applications.</p>
              </div>
              <ArrowRight size={20} className="dashboard-card-arrow" />
            </Link>
          )}
        </div>

        {isMentor && user.mentorColleges?.length > 0 && (
          <div className="dashboard-section animate-fade-in">
            <h2 className="section-title">Colleges You Mentor For</h2>
            <div className="mentor-colleges-list">
              {user.mentorColleges.map((college) => (
                <Link
                  key={college._id || college}
                  to={`/colleges/${college.slug || ''}`}
                  className="mentor-college-item card"
                >
                  <GraduationCap size={20} />
                  <span>{college.name || 'College'}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
