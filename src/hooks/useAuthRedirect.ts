
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { toast } from "@/components/ui/sonner";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (isLoading) return;
    
    const authPages = ['/auth/login', '/auth/signup'];
    const isAuthPage = authPages.includes(location.pathname);
    const isReportsPage = location.pathname === '/reports';

    // If authenticated and on auth page, redirect to home
    if (isAuthenticated && isAuthPage) {
      navigate('/', { replace: true });
      return;
    }
    
    // If not authenticated and not on auth page, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      const from = location.pathname;
      toast.error("Please log in to access this page");
      navigate('/auth/login', { state: { from } });
      return;
    }

    // Check role-based access for reports page
    if (isReportsPage && user && user.role !== 'admin' && user.role !== 'teamlead') {
      toast.error("You don't have permission to access the reports page");
      navigate('/');
      return;
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate, user]);
};

export default useAuthRedirect;
