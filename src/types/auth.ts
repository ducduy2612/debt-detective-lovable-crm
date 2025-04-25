
export type UserRole = 'ADMIN' | 'AGENT' | 'SUPERVISOR';

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  created_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
