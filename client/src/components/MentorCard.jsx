import { User, Mail, Phone, MessageCircle } from 'lucide-react';
import './MentorCard.css';

export default function MentorCard({ mentor }) {
  return (
    <div className="mentor-card card">
      <div className="mentor-card-header">
        <div className="mentor-avatar">
          {mentor.avatar ? (
            <img src={mentor.avatar} alt={mentor.name} />
          ) : (
            <User size={28} />
          )}
        </div>
        <div>
          <h4 className="mentor-name">{mentor.name}</h4>
          <span className="badge badge-primary">Mentor</span>
        </div>
      </div>

      {mentor.bio && (
        <p className="mentor-bio">{mentor.bio}</p>
      )}

      <div className="mentor-actions">
        {mentor.email && (
          <a
            href={`mailto:${mentor.email}`}
            className="btn btn-secondary btn-sm"
            title="Send Email"
          >
            <Mail size={14} />
            Email
          </a>
        )}
        {mentor.whatsapp && (
          <a
            href={`https://wa.me/${mentor.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-sm"
            title="WhatsApp"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        )}
        {mentor.phone && !mentor.whatsapp && (
          <a
            href={`tel:${mentor.phone}`}
            className="btn btn-secondary btn-sm"
            title="Call"
          >
            <Phone size={14} />
            Call
          </a>
        )}
      </div>
    </div>
  );
}
