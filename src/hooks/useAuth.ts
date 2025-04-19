
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
      toast.success("Successfully logged in");
    } catch (error) {
      // Error handling is done at the context level
      // Toast will be shown based on the error state
    }
  };
  
  // Enhance sign-up with toast notifications
  const enhancedSignUp = async (email: string, password: string, name: string) => {
    try {
      await context.signUp(email, password, name);
      toast.success("Account created successfully");
    } catch (error) {
      // Error handling is done at the context level
    }
  };
  
  // Enhance sign-out with toast notifications
  const enhancedSignOut = async () => {
    try {
      await context.signOut();
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
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
