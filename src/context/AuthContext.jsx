import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
    });

    return () => subscription.unsubscribe();
  }, [initializeAuth, fetchProfile]);

  const signUp = async (email, password, fullName, phone) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        setError('Please check your email to confirm your account.');
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Sign up failed. Please try again.';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      return { error: null };
    } catch (err) {
      const errorMessage = err.message || 'Sign out failed. Please try again.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { error: null };
    } catch (err) {
      const errorMessage = err.message || 'Password reset failed. Please try again.';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed. Please try again.';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateAuthUser = async (updates) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Update failed. Please try again.';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    loading,
    error,
    setError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updateAuthUser,
    isAdmin,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};