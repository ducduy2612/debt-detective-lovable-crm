
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (isLoading) return;
    
    const authPages = ['/auth/login', '/auth/signup'];
    const isAuthPage = authPages.includes(location.pathname);

    // If authenticated and on auth page, redirect to home
    if (isAuthenticated && isAuthPage) {
      navigate('/');
      return;
    }
    
    // If not authenticated and not on auth page, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      const from = location.pathname;
      navigate('/auth/login', { state: { from } });
      return;
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);
};

export default useAuthRedirect;
