import { Link } from 'react-router-dom';
import { MapPin, ExternalLink, Users } from 'lucide-react';
import './CollegeCard.css';

export default function CollegeCard({ college }) {
  return (
    <div className="college-card card animate-fade-in">
      <div className="college-card-img">
        {college.image ? (
          <img src={college.image} alt={college.name} />
        ) : (
          <div className="college-card-img-placeholder">
            <span>{college.name?.charAt(0)}</span>
          </div>
        )}
        {college.tags?.length > 0 && (
          <div className="college-card-tags">
            {college.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="college-card-body">
        <h3 className="college-card-name">{college.name}</h3>
        <p className="college-card-location">
          <MapPin size={14} />
          {college.location}
        </p>
        <p className="college-card-desc">
          {college.description?.length > 120
            ? college.description.substring(0, 120) + '...'
            : college.description}
        </p>
      </div>

      <div className="college-card-actions">
        <Link to={`/colleges/${college.slug}`} className="btn btn-primary btn-sm">
          <Users size={14} />
          View Details
        </Link>
        {college.registrationLink && (
          <a
            href={college.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <ExternalLink size={14} />
            Register
          </a>
        )}
      </div>
    </div>
  );
}
