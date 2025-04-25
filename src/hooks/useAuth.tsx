
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
      toast.success("Successfully signed in!");
    } catch (error) {
      toast.error((error as Error).message || 'Invalid email or password');
      throw error;
    }
  };
  
  // Enhance sign-up with toast notifications
  const enhancedSignUp = async (email: string, password: string, name: string) => {
    try {
      await context.signUp(email, password, name);
      toast.success("Account created successfully! Please sign in.");
    } catch (error) {
      toast.error((error as Error).message || 'Failed to create account');
      throw error;
    }
  };
  
  // Enhance sign-out with toast notifications
  const enhancedSignOut = async () => {
    try {
      await context.signOut();
      toast.success("Successfully signed out!");
    } catch (error) {
      toast.error((error as Error).message || 'Failed to sign out');
      throw error;
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
