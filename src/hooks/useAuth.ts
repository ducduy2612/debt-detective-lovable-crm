
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { toast } from "@/components/ui/sonner";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Enhance sign-in with toast notifications
  const enhancedSignIn = async (email: string, password: string) => {
    try {
      await context.signIn(email, password);
    } catch (error) {
      // Error handling is done at the context level
    }
  };
  
  // Enhance sign-up with toast notifications
  const enhancedSignUp = async (email: string, password: string, name: string) => {
    try {
      await context.signUp(email, password, name);
    } catch (error) {
      // Error handling is done at the context level
    }
  };
  
  // Enhance sign-out with toast notifications
  const enhancedSignOut = async () => {
    try {
      await context.signOut();
    } catch (error) {
      // Error handling is done at the context level
    }
  };
  
  return {
    ...context,
    signIn: enhancedSignIn,
    signUp: enhancedSignUp,
    signOut: enhancedSignOut,
  };
};

export default useAuth;
