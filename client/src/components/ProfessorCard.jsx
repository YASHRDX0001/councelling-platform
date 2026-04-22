import { Mail, MessageCircle, User } from 'lucide-react';
import './ProfessorCard.css';

export default function ProfessorCard({ professor }) {
  const handleWhatsApp = () => {
    const number = professor.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <div className="prof-card card animate-fade-in">
      <div className="prof-header">
        <div className="prof-avatar">
          {professor.avatar ? (
            <img src={professor.avatar} alt={professor.name} />
          ) : (
            <div className="prof-avatar-placeholder">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="prof-info">
          <h3 className="prof-name">{professor.name}</h3>
          <p className="prof-bio">{professor.bio || 'Department of Academics'}</p>
        </div>
      </div>

      <div className="prof-actions">
        <a href={`mailto:${professor.email}`} className="btn btn-ghost btn-sm prof-action-btn">
          <Mail size={16} />
          Email
        </a>
        {professor.whatsapp && (
          <button onClick={handleWhatsApp} className="btn btn-primary btn-sm prof-action-btn prof-wa-btn">
            <MessageCircle size={16} />
            WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
