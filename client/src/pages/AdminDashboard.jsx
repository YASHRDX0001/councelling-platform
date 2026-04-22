import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X, Users, GraduationCap, Clock, Settings, Key } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('colleges');
  const [colleges, setColleges] = useState([]);
  const [applications, setApplications] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Settings state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Mentor form state
  const emptyMentorForm = {
    name: '', email: '', password: '', bio: '', phone: '', whatsapp: '', mentorColleges: [], isSpecial: false
  };
  const [mentorForm, setMentorForm] = useState(emptyMentorForm);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [savingMentor, setSavingMentor] = useState(false);

  // Professor form state
  const emptyProfessorForm = {
    name: '', email: '', password: '', bio: '', phone: '', whatsapp: '', mentorColleges: []
  };
  const [professorForm, setProfessorForm] = useState(emptyProfessorForm);
  const [showAddProfessor, setShowAddProfessor] = useState(false);
  const [savingProfessor, setSavingProfessor] = useState(false);

  // College form
  const emptyForm = {
    name: '', description: '', location: '', image: '',
    registrationLink: '', tags: '', ranking: '', fees: '', website: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegesRes, appsRes, mentorsRes, profsRes] = await Promise.all([
        api.get('/colleges'),
        api.get('/mentors/applications'),
        api.get('/users/admin/mentors'),
        api.get('/users/admin/professors'),
      ]);
      setColleges(collegesRes.data.colleges);
      setApplications(appsRes.data.applications);
      setMentors(mentorsRes.data.mentors || []);
      setProfessors(profsRes.data.professors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitCollege = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      if (editingId) {
        const res = await api.put(`/colleges/${editingId}`, payload);
        setColleges(colleges.map((c) => (c._id === editingId ? res.data.college : c)));
        toast.success('College updated!');
      } else {
        const res = await api.post('/colleges', payload);
        setColleges([res.data.college, ...colleges]);
        toast.success('College added!');
      }
      setForm(emptyForm);
      setShowAddForm(false);
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save college');
    }
  };

  const handleEditCollege = (college) => {
    setForm({
      name: college.name || '',
      description: college.description || '',
      location: college.location || '',
      image: college.image || '',
      registrationLink: college.registrationLink || '',
      tags: college.tags?.join(', ') || '',
      ranking: college.ranking || '',
      fees: college.fees || '',
      website: college.website || '',
    });
    setEditingId(college._id);
    setShowAddForm(true);
  };

  const handleDeleteCollege = async (id) => {
    if (!confirm('Are you sure you want to delete this college?')) return;
    try {
      await api.delete(`/colleges/${id}`);
      setColleges(colleges.filter((c) => c._id !== id));
      toast.success('College deleted');
    } catch (err) {
      toast.error('Failed to delete college');
    }
  };

  const handleApplicationAction = async (id, status) => {
    try {
      await api.put(`/mentors/applications/${id}`, { status });
      setApplications(applications.map((a) =>
        a._id === id ? { ...a, status } : a
      ));
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error('Failed to update application');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Minimum 6 characters');

    try {
      setChangingPass(true);
      await api.post('/auth/admin/change-password', { newPassword });
      toast.success('Admin password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPass(false);
    }
  };

  const handleSubmitMentor = async (e) => {
    e.preventDefault();
    if (mentorForm.mentorColleges.length === 0) return toast.error('Select at least one college');

    try {
      setSavingMentor(true);
      const res = await api.post('/users/admin/mentors', mentorForm);
      setMentors([res.data.mentor, ...mentors]);
      toast.success('Mentor created successfully');
      setMentorForm(emptyMentorForm);
      setShowAddMentor(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create mentor');
    } finally {
      setSavingMentor(false);
    }
  };

  const handleDeleteMentor = async (id) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;
    try {
      await api.delete(`/users/admin/mentors/${id}`);
      setMetors(mentors.filter((m) => m._id !== id));
      toast.success('Mentor deleted');
    } catch (err) {
      toast.error('Failed to delete mentor');
    }
  };

  const handleToggleSpecial = async (id, currentStatus) => {
    try {
      const res = await api.patch(`/users/admin/mentors/${id}/special`, { isSpecial: !currentStatus });
      setMentors(mentors.map(m => m._id === id ? { ...m, isSpecial: res.data.mentor.isSpecial } : m));
      toast.success(res.data.mentor.isSpecial ? 'Marked as Special Mentor' : 'Removed from Special Mentors');
    } catch (err) {
      toast.error('Failed to update special status');
    }
  };

  const handleSubmitProfessor = async (e) => {
    e.preventDefault();
    if (professorForm.mentorColleges.length === 0) return toast.error('Select at least one college');

    try {
      setSavingProfessor(true);
      const res = await api.post('/users/admin/professors', professorForm);
      setProfessors([res.data.professor, ...professors]);
      toast.success('Professor profile created');
      setProfessorForm(emptyProfessorForm);
      setShowAddProfessor(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create professor');
    } finally {
      setSavingProfessor(false);
    }
  };

  const handleDeleteProfessor = async (id) => {
    if (!confirm('Are you sure you want to delete this professor?')) return;
    try {
      await api.delete(`/users/admin/professors/${id}`);
      setProfessors(professors.filter((p) => p._id !== id));
      toast.success('Professor deleted');
    } catch (err) {
      toast.error('Failed to delete professor');
    }
  };

  if (loading) return <Loader />;

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="page">
      <Toaster position="top-center" toastOptions={{ className: 'toast-custom' }} />
      <div className="container">
        <div className="admin-header animate-fade-in">
          <h1 className="page-title">Admin <span className="text-gradient">Dashboard</span></h1>
          <p className="page-subtitle">Manage colleges and mentor applications</p>
        </div>

        {/* Stats */}
        <div className="admin-stats animate-fade-in">
          <div className="admin-stat-card card">
            <GraduationCap size={24} className="stat-icon" />
            <div>
              <p className="stat-number">{colleges.length}</p>
              <p className="stat-label">Colleges</p>
            </div>
          </div>
          <div className="admin-stat-card card">
            <Users size={24} className="stat-icon stat-icon-2" />
            <div>
              <p className="stat-number">{applications.length}</p>
              <p className="stat-label">Total Applications</p>
            </div>
          </div>
          <div className="admin-stat-card card">
            <Clock size={24} className="stat-icon stat-icon-3" />
            <div>
              <p className="stat-number">{pendingCount}</p>
              <p className="stat-label">Pending Review</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs animate-fade-in">
          <button
            className={`tab ${activeTab === 'colleges' ? 'active' : ''}`}
            onClick={() => setActiveTab('colleges')}
          >
            <GraduationCap size={16} />
            Colleges ({colleges.length})
          </button>
          <button
            className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <Users size={16} />
            Applications ({pendingCount} pending)
          </button>
          <button
            className={`tab ${activeTab === 'mentors' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentors')}
          >
            <Users size={16} />
            Mentors ({mentors.length})
          </button>
          <button
            className={`tab ${activeTab === 'professors' ? 'active' : ''}`}
            onClick={() => setActiveTab('professors')}
          >
            <Users size={16} />
            Professors ({professors.length})
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        {/* Colleges Tab */}
        {activeTab === 'colleges' && (
          <div className="animate-fade-in">
            <div className="admin-toolbar">
              <button
                className="btn btn-primary"
                onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setForm(emptyForm); }}
              >
                <Plus size={16} />
                {showAddForm ? 'Cancel' : 'Add College'}
              </button>
            </div>

            {showAddForm && (
              <div className="card admin-form animate-slide-down">
                <h3>{editingId ? 'Edit College' : 'Add New College'}</h3>
                <form onSubmit={handleSubmitCollege}>
                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label className="form-label">College Name *</label>
                      <input className="form-input" name="name" value={form.name} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location *</label>
                      <input className="form-input" name="location" value={form.location} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input className="form-input" name="image" value={form.image} onChange={handleFormChange} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Registration Link (Referral)</label>
                      <input className="form-input" name="registrationLink" value={form.registrationLink} onChange={handleFormChange} placeholder="https://..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tags (comma-separated)</label>
                      <input className="form-input" name="tags" value={form.tags} onChange={handleFormChange} placeholder="Engineering, MBA, Medical" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ranking</label>
                      <input className="form-input" name="ranking" value={form.ranking} onChange={handleFormChange} placeholder="e.g., NIRF #5" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fees</label>
                      <input className="form-input" name="fees" value={form.fees} onChange={handleFormChange} placeholder="e.g., ₹2,00,000/year" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input className="form-input" name="website" value={form.website} onChange={handleFormChange} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Description *</label>
                    <textarea className="form-textarea" name="description" value={form.description} onChange={handleFormChange} required rows={4} />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update College' : 'Add College'}
                  </button>
                </form>
              </div>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>College</th>
                    <th>Location</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((college) => (
                    <tr key={college._id}>
                      <td>
                        <div className="table-college-name">
                          {college.image && <img src={college.image} alt="" className="table-college-img" />}
                          <span>{college.name}</span>
                        </div>
                      </td>
                      <td>{college.location}</td>
                      <td>
                        <div className="table-tags">
                          {college.tags?.map((t) => (
                            <span key={t} className="badge badge-info">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEditCollege(college)}>
                            <Edit3 size={14} />
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteCollege(college._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {colleges.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
                  <p>No colleges yet. Click "Add College" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            {applications.length === 0 ? (
              <div className="empty-state">
                <Users size={64} />
                <p>No mentor applications yet</p>
              </div>
            ) : (
              <div className="apps-grid stagger-children">
                {applications.map((app) => (
                  <div key={app._id} className="card app-review-card">
                    <div className="app-review-header">
                      <div>
                        <h4>{app.user?.name || 'User'}</h4>
                        <p className="app-review-email">{app.user?.email}</p>
                      </div>
                      <span className={`badge ${
                        app.status === 'pending' ? 'badge-warning' :
                        app.status === 'approved' ? 'badge-success' : 'badge-error'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="app-review-college">
                      <GraduationCap size={14} />
                      <span>{app.college?.name || 'College'}</span>
                    </div>
                    <p className="app-review-exp">{app.experience}</p>
                    {app.status === 'pending' && (
                      <div className="app-review-actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApplicationAction(app._id, 'approved')}
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleApplicationAction(app._id, 'rejected')}
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="animate-fade-in">
            <div className="admin-toolbar">
              <button className="btn btn-primary" onClick={() => setShowAddMentor(!showAddMentor)}>
                <Plus size={16} />
                {showAddMentor ? 'Cancel' : 'Add Mentor'}
              </button>
            </div>

            {showAddMentor && (
              <div className="card admin-form animate-slide-down">
                <h3 style={{ marginBottom: 'var(--space-6)' }}>Add New Mentor</h3>
                <form onSubmit={handleSubmitMentor}>
                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" value={mentorForm.name} onChange={(e) => setMentorForm({...mentorForm, name: e.target.value})} placeholder="Full Name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" value={mentorForm.email} onChange={(e) => setMentorForm({...mentorForm, email: e.target.value})} placeholder="email@example.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">System Password *</label>
                      <input className="form-input" type="password" value={mentorForm.password} onChange={(e) => setMentorForm({...mentorForm, password: e.target.value})} placeholder="For mentor to log in" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={mentorForm.phone} onChange={(e) => setMentorForm({...mentorForm, phone: e.target.value})} placeholder="+91..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">WhatsApp</label>
                      <input className="form-input" value={mentorForm.whatsapp} onChange={(e) => setMentorForm({...mentorForm, whatsapp: e.target.value})} placeholder="WhatsApp link/number" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned College(s) *</label>
                      <select 
                        className="form-input" 
                        multiple 
                        value={mentorForm.mentorColleges} 
                        onChange={(e) => setMentorForm({...mentorForm, mentorColleges: Array.from(e.target.selectedOptions, option => option.value)})}
                        style={{ height: 'auto', minHeight: '120px' }}
                      >
                        {colleges.map(c => <option key={c._id} value={c._id}>{c.name} ({c.location})</option>)}
                      </select>
                      <small className="form-help">Hold Ctrl/Cmd to select multiple colleges</small>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <input 
                        type="checkbox" 
                        id="isSpecial"
                        checked={mentorForm.isSpecial} 
                        onChange={(e) => setMentorForm({...mentorForm, isSpecial: e.target.checked})} 
                      />
                      <label htmlFor="isSpecial" className="form-label" style={{ marginBottom: 0 }}>Mark as Special Mentor (Home Page)</label>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Bio / Experience</label>
                      <textarea className="form-textarea" value={mentorForm.bio} onChange={(e) => setMentorForm({...mentorForm, bio: e.target.value})} rows={3} placeholder="Tell students about this mentor's achievements..." />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingMentor} style={{ marginTop: 'var(--space-4)' }}>
                    {savingMentor ? 'Creating...' : 'Create Mentor Account'}
                  </button>
                </form>
              </div>
            )}

            <div className="admin-table-wrapper card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mentor</th>
                    <th>Email</th>
                    <th>Assigned College(s)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr key={mentor._id}>
                      <td>
                        <div className="table-college-name">
                          <div className="nav-avatar" style={{ width: '32px', height: '32px', background: 'var(--gradient-primary)', color: 'white' }}>
                            {mentor.avatar ? <img src={mentor.avatar} alt="" /> : <Users size={14} />}
                          </div>
                          <span style={{ fontWeight: 600 }}>{mentor.name}</span>
                          {mentor.isSpecial && <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 6px' }}>Special</span>}
                        </div>
                      </td>
                      <td>{mentor.email}</td>
                      <td>
                        <div className="table-tags">
                          {mentor.mentorColleges?.map((c) => (
                            <span key={c._id} className="badge badge-primary" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: mentor.isSpecial ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                            onClick={() => handleToggleSpecial(mentor._id, mentor.isSpecial)}
                            title={mentor.isSpecial ? "Remove Special Status" : "Mark as Special"}
                          >
                            <Sparkles size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: 'var(--color-error)' }} 
                            onClick={() => handleDeleteMentor(mentor._id)}
                            title="Delete Mentor"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mentors.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
                  <Users size={48} style={{ opacity: 0.2, marginBottom: 'var(--space-4)' }} />
                  <p>No mentors found. Add your first mentor to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professors Tab */}
        {activeTab === 'professors' && (
          <div className="animate-fade-in">
            <div className="admin-toolbar">
              <button className="btn btn-primary" onClick={() => setShowAddProfessor(!showAddProfessor)}>
                <Plus size={16} />
                {showAddProfessor ? 'Cancel' : 'Add Professor'}
              </button>
            </div>

            {showAddProfessor && (
              <div className="card admin-form animate-slide-down">
                <h3 style={{ marginBottom: 'var(--space-6)' }}>Add New Professor</h3>
                <form onSubmit={handleSubmitProfessor}>
                  <div className="admin-form-grid">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" value={professorForm.name} onChange={(e) => setProfessorForm({...professorForm, name: e.target.value})} placeholder="Full Name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" value={professorForm.email} onChange={(e) => setProfessorForm({...professorForm, email: e.target.value})} placeholder="email@example.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">System Password *</label>
                      <input className="form-input" type="password" value={professorForm.password} onChange={(e) => setProfessorForm({...professorForm, password: e.target.value})} placeholder="Password" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={professorForm.phone} onChange={(e) => setProfessorForm({...professorForm, phone: e.target.value})} placeholder="+91..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">WhatsApp</label>
                      <input className="form-input" value={professorForm.whatsapp} onChange={(e) => setProfessorForm({...professorForm, whatsapp: e.target.value})} placeholder="WhatsApp link/number" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned College(s) *</label>
                      <select 
                        className="form-input" 
                        multiple 
                        value={professorForm.mentorColleges} 
                        onChange={(e) => setProfessorForm({...professorForm, mentorColleges: Array.from(e.target.selectedOptions, option => option.value)})}
                        style={{ height: 'auto', minHeight: '120px' }}
                      >
                        {colleges.map(c => <option key={c._id} value={c._id}>{c.name} ({c.location})</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Bio / Department / Expertise</label>
                      <textarea className="form-textarea" value={professorForm.bio} onChange={(e) => setProfessorForm({...professorForm, bio: e.target.value})} rows={3} placeholder="e.g. HOD Computer Science, 15 years research exp..." />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={savingProfessor} style={{ marginTop: 'var(--space-4)' }}>
                    {savingProfessor ? 'Creating...' : 'Create Professor Profile'}
                  </button>
                </form>
              </div>
            )}

            <div className="admin-table-wrapper card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Professor</th>
                    <th>Email</th>
                    <th>College(s)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {professors.map((prof) => (
                    <tr key={prof._id}>
                      <td>
                        <div className="table-college-name">
                          <div className="nav-avatar" style={{ width: '32px', height: '32px', background: 'var(--color-accent-2)', color: 'white' }}>
                            {prof.avatar ? <img src={prof.avatar} alt="" /> : <Users size={14} />}
                          </div>
                          <span style={{ fontWeight: 600 }}>{prof.name}</span>
                        </div>
                      </td>
                      <td>{prof.email}</td>
                      <td>
                        <div className="table-tags">
                          {prof.mentorColleges?.map((c) => (
                            <span key={c._id} className="badge badge-secondary" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent-2)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn btn-ghost btn-sm" 
                            style={{ color: 'var(--color-error)' }} 
                            onClick={() => handleDeleteProfessor(prof._id)}
                            title="Delete Professor"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {professors.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
                  <Users size={48} style={{ opacity: 0.2, marginBottom: 'var(--space-4)' }} />
                  <p>No professors added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                <div style={{ padding: 'var(--space-2)', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px' }}>
                  <Key size={20} color="var(--primary)" />
                </div>
                <h3>Dashboard Password</h3>
              </div>
              <p className="form-help" style={{ marginBottom: 'var(--space-6)' }}>
                Change the password used to access this admin route. Make sure to keep it secure.
              </p>
              
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={changingPass}>
                  {changingPass ? 'Updating...' : 'Update Portal Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
