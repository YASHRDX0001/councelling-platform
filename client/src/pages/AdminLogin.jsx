import { useState } from 'react';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return toast.error('Enter admin password');

    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', { password });
      localStorage.setItem('token', res.data.token);
      updateUser(res.data.user);
      toast.success('Access granted, welcome Admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized access</h2>');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Toaster position="top-center" />
      <div className="admin-login-card card">
        <div className="admin-login-icon">
          <Shield size={32} />
        </div>
        <h1 className="admin-login-title">Admin <span className="text-gradient">Access</span></h1>
        <p className="admin-login-subtitle">A password is required to enter the secure portal</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              <input
                type="password"
                className="form-input"
                placeholder="Enter Portal Password"
                style={{ paddingLeft: '3rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', gap: 'var(--space-2)' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : (
              <>
                Unlock Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
