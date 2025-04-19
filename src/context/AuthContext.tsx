
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, UserProfile, UserRole } from '@/types/auth';
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
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Synchronous state update for session
          setState(prevState => ({
            ...prevState,
            session,
            isAuthenticated: !!session,
          }));

          // Defer Supabase profile fetch with setTimeout
          if (session?.user) {
            setTimeout(async () => {
              const userId = session.user.id;
              const userProfile = await fetchUserProfile(userId);

              if (userProfile) {
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
            }, 0);
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

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setState(prevState => ({
          ...prevState,
          session,
          isAuthenticated: true,
        }));

        // Fetch user profile with setTimeout to prevent Supabase deadlock
        setTimeout(async () => {
          const userProfile = await fetchUserProfile(session.user.id);
          
          setState(prevState => ({
            ...prevState,
            user: userProfile,
            isLoading: false,
          }));
        }, 0);
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
      // Determine if this is the first user (for admin role)
      const isAdmin = await isFirstUser();
      const role: UserRole = isAdmin ? 'admin' : 'agent'; // Default to agent if not first user
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile entry for the new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: name,
            role: role
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('Failed to create user profile');
        }
        
        // Set local state and show success toast
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: null
        }));
        
        toast.success("Account created successfully! Please sign in.");
      }
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
      } else {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
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

  // Clear error state
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
