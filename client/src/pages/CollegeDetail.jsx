import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ExternalLink, Globe, IndianRupee, Trophy, ArrowLeft, Users } from 'lucide-react';
import MentorCard from '../components/MentorCard';
import ProfessorCard from '../components/ProfessorCard';
import Loader from '../components/Loader';
import api from '../services/api';
import './CollegeDetail.css';

export default function CollegeDetail() {
  const { slug } = useParams();
  const [college, setCollege] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await api.get(`/colleges/${slug}`);
        setCollege(res.data.college);
        setMentors(res.data.mentors || []);
        setProfessors(res.data.professors || []);
      } catch (err) {
        console.error('Failed to fetch college:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [slug]);

  if (loading) return <Loader />;

  if (!college) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <p>College not found</p>
            <Link to="/colleges" className="btn btn-primary">Back to Colleges</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/colleges" className="back-link animate-fade-in">
          <ArrowLeft size={16} />
          Back to Colleges
        </Link>

        <div className="college-detail animate-fade-in">
          {/* Hero Banner */}
          <div className="college-detail-hero">
            {college.image ? (
              <img src={college.image} alt={college.name} />
            ) : (
              <div className="college-detail-hero-placeholder">
                <span>{college.name?.charAt(0)}</span>
              </div>
            )}
            <div className="college-detail-hero-overlay" />
          </div>

          {/* Info Section */}
          <div className="college-detail-content">
            <div className="college-detail-header">
              <div>
                <div className="college-detail-tags">
                  {college.tags?.includes('new gen') && (
                    <span className="badge badge-success animate-pulse" style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white' }}>
                      ✨ New Gen College (Verified)
                    </span>
                  )}
                  {college.tags?.filter(t => t !== 'new gen').map((tag) => (
                    <span key={tag} className="badge badge-primary">{tag}</span>
                  ))}
                </div>
                <h1 className="college-detail-name">{college.name}</h1>
                <p className="college-detail-location">
                  <MapPin size={16} />
                  {college.location}
                </p>
              </div>

              <div className="college-detail-actions">
                {college.registrationLink && (
                  <a
                    href={college.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                  >
                    <ExternalLink size={18} />
                    Register for this College
                  </a>
                )}
                <a href="#mentors" className="btn btn-secondary btn-lg">
                  <Users size={18} />
                  View Mentors ({mentors.length})
                </a>
              </div>
            </div>

            <div className="college-detail-body">
              <div className="college-detail-main">
                <div className="college-detail-section">
                  <h2>About</h2>
                  <p>{college.description}</p>
                </div>
              </div>

              <div className="college-detail-sidebar">
                {college.ranking && (
                  <div className="sidebar-item">
                    <Trophy size={16} className="sidebar-icon" />
                    <div>
                      <span className="sidebar-label">Ranking</span>
                      <span className="sidebar-value">{college.ranking}</span>
                    </div>
                  </div>
                )}
                {college.fees && (
                  <div className="sidebar-item">
                    <IndianRupee size={16} className="sidebar-icon" />
                    <div>
                      <span className="sidebar-label">Fees</span>
                      <span className="sidebar-value">{college.fees}</span>
                    </div>
                  </div>
                )}
                {college.website && (
                  <div className="sidebar-item">
                    <Globe size={16} className="sidebar-icon" />
                    <div>
                      <span className="sidebar-label">Website</span>
                      <a href={college.website} target="_blank" rel="noopener noreferrer" className="sidebar-value sidebar-link">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mentors Section */}
            <div className="college-detail-section" id="mentors">
              <h2>
                <Users size={20} />
                Mentors from this College ({mentors.length})
              </h2>
              {mentors.length === 0 ? (
                <div className="mentors-empty card-glass">
                  <p>No mentors available for this college yet.</p>
                </div>
              ) : (
                <div className="grid grid-3 stagger-children">
                  {mentors.map((mentor) => (
                    <MentorCard key={mentor._id} mentor={mentor} />
                  ))}
                </div>
              )}
            </div>

            {/* Professors Section */}
            <div className="college-detail-section" id="professors" style={{ marginTop: 'var(--space-12)' }}>
              <h2>
                <Users size={20} className="text-gradient" />
                Connect with College Professors ({professors.length})
              </h2>
              <p className="section-subtitle" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '600px' }}>
                Directly interact with the academic experts and faculty members to understand the curriculum and research opportunities.
              </p>
              {professors.length === 0 ? (
                <div className="mentors-empty card-glass">
                  <p>No professor contacts available for this college yet.</p>
                </div>
              ) : (
                <div className="grid grid-3 stagger-children">
                  {professors.map((professor) => (
                    <ProfessorCard key={professor._id} professor={professor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
