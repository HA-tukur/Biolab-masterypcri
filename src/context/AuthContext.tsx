import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  learningType: string;
  university: string;
  programDepartment: string;
  yearOfStudy: string;
  referralSource: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('=== AUTH CONTEXT: Initial Session ===');
      console.log('User email:', session?.user?.email);
      console.log('User app_metadata:', session?.user?.app_metadata);
      console.log('====================================');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('=== AUTH CONTEXT: Auth State Changed ===');
      console.log('Event:', _event);
      console.log('User email:', session?.user?.email);
      console.log('User app_metadata:', session?.user?.app_metadata);
      console.log('========================================');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          learning_type: data.learningType,
          university: data.university,
          program_department: data.programDepartment,
          year_of_study: data.yearOfStudy,
          referral_source: data.referralSource,
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('=== AUTH CONTEXT: signIn called ===');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Sign in error:', error.message);
      return { error, user: null };
    }

    console.log('Sign in successful, refreshing session...');
    // Refresh the session to ensure we have the latest user data including app_metadata
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    if (refreshError) {
      console.log('Session refresh error:', refreshError.message);
    } else {
      console.log('Session refreshed, user app_metadata:', refreshData.user?.app_metadata);
    }

    const finalUser = refreshData?.user ?? data.user;
    console.log('Final user after refresh:', finalUser?.email, 'app_metadata:', finalUser?.app_metadata);
    console.log('===================================');

    return { error: null, user: finalUser };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
