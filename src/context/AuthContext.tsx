
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, UserProfile } from '@/types/auth';
import { toast } from "@/components/ui/sonner";

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Function to fetch user profile after authentication
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Check if this is the first user in the system (to assign admin role)
  const isFirstUser = async (): Promise<boolean> => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error checking if first user:', error);
        return false;
      }

      return count === 0;
    } catch (error) {
      console.error('Error in isFirstUser:', error);
      return false;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setState(prevState => ({
            ...prevState,
            session,
            isAuthenticated: !!session,
          }));

          if (session?.user) {
            const userProfile = await fetchUserProfile(session.user.id);
            setState(prevState => ({
              ...prevState,
              user: userProfile,
              isLoading: false,
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            error: null
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setState(prevState => ({
          ...prevState,
          session,
          isAuthenticated: true,
        }));

        const userProfile = await fetchUserProfile(session.user.id);
        setState(prevState => ({
          ...prevState,
          user: userProfile,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name  // Store name in user_metadata for the trigger
          }
        }
      });
      
      if (error) throw error;
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: null
      }));
      
      toast.success("Account created successfully! Please sign in.");
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error.message || 'Failed to create account'
      }));
      
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        setState(prevState => ({
          ...prevState,
          user: profile,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        toast.success("Successfully signed in!");
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error.message || 'Invalid email or password'
      }));
      
      toast.error(error.message || 'Invalid email or password');
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
      
      toast.success("Successfully signed out!");
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error.message || 'Failed to sign out'
      }));
      
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const clearError = () => {
    setState(prevState => ({ ...prevState, error: null }));
  };


  const contextValue: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
