import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Search, ArrowRight, Sparkles, Shield, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MentorCard from '../components/MentorCard';
import api from '../services/api';
import './Home.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [specialMentors, setSpecialMentors] = useState([]);

  useEffect(() => {
    const fetchSpecialMentors = async () => {
      try {
        const res = await api.get('/users/special-mentors');
        setSpecialMentors(res.data.mentors || []);
      } catch (err) {
        console.error('Failed to fetch special mentors:', err);
      }
    };
    fetchSpecialMentors();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Your College Journey Starts Here</span>
            </div>
            <h1 className="hero-title">
              Find Your Perfect <span className="text-gradient">College</span> With
              <br />Real Mentor Guidance
            </h1>
            <p className="hero-subtitle">
              Connect with verified college mentors who've been there, done that.
              Get honest insights, real advice, and make confident decisions about your future.
            </p>
            <div className="hero-actions">
              <Link to="/colleges" className="btn btn-primary btn-lg">
                <Search size={18} />
                Explore Colleges
              </Link>
              {!isAuthenticated && (
                <Link to="/signup" className="btn btn-secondary btn-lg">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Colleges Listed</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">200+</span>
                <span className="hero-stat-label">Active Mentors</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">5000+</span>
                <span className="hero-stat-label">Students Helped</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-glow" />
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="how-header animate-fade-in">
            <h2 className="section-title">How It <span className="text-gradient">Works</span></h2>
            <p className="page-subtitle" style={{ margin: '0 auto' }}>
              Three simple steps to get the guidance you need
            </p>
          </div>

          <div className="how-grid stagger-children">
            <div className="how-card card">
              <div className="how-icon">
                <Search size={28} />
              </div>
              <h3>Browse Colleges</h3>
              <p>Explore our curated list of colleges with detailed information, rankings, and fee structures.</p>
            </div>

            <div className="how-card card">
              <div className="how-icon how-icon-2">
                <Users size={28} />
              </div>
              <h3>Connect with Mentors</h3>
              <p>Find verified mentors from your target colleges. Reach out via email or WhatsApp for real insights.</p>
            </div>

            <div className="how-card card">
              <div className="how-icon how-icon-3">
                <GraduationCap size={28} />
              </div>
              <h3>Make Your Decision</h3>
              <p>Armed with authentic information and guidance, confidently choose the right college for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Mentors Section */}
      {specialMentors.length > 0 && (
        <section className="section special-mentors-section">
          <div className="container">
            <div className="section-header animate-fade-in" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
              <div className="hero-badge" style={{ margin: '0 auto var(--space-4)' }}>
                <Star size={14} fill="currentColor" />
                <span>Expert Guidance</span>
              </div>
              <h2 className="section-title">Meet Our <span className="text-gradient">Expert Mentors</span></h2>
              <p className="page-subtitle" style={{ margin: '0 auto' }}>
                Get advice from the best in the community who are ready to help you succeed
              </p>
            </div>

            <div className="special-mentors-grid animate-fade-in" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-12)'
            }}>
              {specialMentors.slice(0, 3).map((mentor) => (
                <MentorCard key={mentor._id} mentor={mentor} />
              ))}
            </div>

            <div className="special-mentors-cta animate-fade-in" style={{ textAlign: 'center' }}>
              <Link to="/colleges" className="btn btn-ghost" style={{ gap: 'var(--space-2)' }}>
                View All Mentors
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="special-mentors-glow" />
        </section>
      )}

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item animate-fade-in">
              <Shield size={20} className="feature-icon" />
              <div>
                <h4>Verified Mentors</h4>
                <p>All mentors are reviewed and approved by our admin team</p>
              </div>
            </div>
            <div className="feature-item animate-fade-in">
              <MessageCircle size={20} className="feature-icon" />
              <div>
                <h4>Direct Contact</h4>
                <p>Connect directly via email or WhatsApp — no middleman</p>
              </div>
            </div>
            <div className="feature-item animate-fade-in">
              <GraduationCap size={20} className="feature-icon" />
              <div>
                <h4>Real Experience</h4>
                <p>Get advice from students who are currently enrolled</p>
              </div>
            </div>
            <div className="feature-item animate-fade-in">
              <Sparkles size={20} className="feature-icon" />
              <div>
                <h4>100% Free</h4>
                <p>No charges for students to browse and connect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-card card-glass animate-fade-in">
            <h2>Ready to Guide Students?</h2>
            <p>Share your college experience and help others make the right choice. Become a mentor today.</p>
            <div className="cta-actions">
              <Link to="/become-mentor" className="btn btn-primary btn-lg">
                Become a Mentor
              </Link>
              <Link to="/colleges" className="btn btn-secondary btn-lg">
                Browse Colleges
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
