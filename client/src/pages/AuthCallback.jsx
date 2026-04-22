import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Reload to pick up the new auth state
      window.location.href = '/dashboard';
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, []);

  return <Loader />;
}
