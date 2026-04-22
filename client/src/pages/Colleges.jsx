import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import Loader from '../components/Loader';
import api from '../services/api';
import './Colleges.css';

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await api.get('/colleges');
      setColleges(res.data.colleges);
      // Extract unique tags
      const tags = [...new Set(res.data.colleges.flatMap((c) => c.tags || []))];
      setAllTags(tags);
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || c.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="container">
        <div className="colleges-header animate-fade-in">
          <h1 className="page-title">Explore <span className="text-gradient">Colleges</span></h1>
          <p className="page-subtitle">
            Discover colleges, learn about them, and connect with mentors who can guide you.
          </p>
        </div>

        <div className="colleges-filters animate-fade-in">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search by college name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div className="filter-tags">
              <SlidersHorizontal size={16} />
              <button
                className={`tag ${!selectedTag ? 'tag-active' : ''}`}
                onClick={() => setSelectedTag('')}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag ${selectedTag === tag ? 'tag-active' : ''}`}
                  onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={64} />
            <p>No colleges found</p>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              {search || selectedTag ? 'Try adjusting your search or filters' : 'Colleges will appear here once added by the admin'}
            </span>
          </div>
        ) : (
          <div className="grid grid-3 stagger-children">
            {filtered.map((college) => (
              <CollegeCard key={college._id} college={college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
