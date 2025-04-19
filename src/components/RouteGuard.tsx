
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/components/ui/sonner";
import { UserRole } from '@/types/auth';

interface RouteGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRoles = ['admin', 'agent', 'teamlead'] 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) {
      return;
    }
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate('/auth/login', { state: { from: window.location.pathname } });
      return;
    }
    
    // If authenticated but role is not allowed
    if (user && !requiredRoles.includes(user.role)) {
      toast.error("You don't have permission to access this page");
      navigate('/');
      return;
    }
  }, [isAuthenticated, isLoading, user, navigate, requiredRoles]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If not authenticated or role not allowed, render nothing (redirect happens in useEffect)
  if (!isAuthenticated || (user && !requiredRoles.includes(user.role))) {
    return null;
  }
  
  // Render children if authenticated and role is allowed
  return <>{children}</>;
};

export default RouteGuard;
