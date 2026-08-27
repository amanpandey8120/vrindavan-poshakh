import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to map error messages to devotee-friendly explanations
  const formatAuthError = (err) => {
    if (!err) return null;
    const msg = typeof err === 'string' ? err : err.message || '';
    const lower = msg.toLowerCase();

    if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
      return 'Invalid email or password. Please verify your credentials and try again.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Please verify your email address before signing in. Check your inbox for the confirmation link.';
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'An account with this email address is already registered. Please sign in instead.';
    }
    if (lower.includes('weak password') || lower.includes('password should be') || lower.includes('password is too weak')) {
      return 'Password is too weak. Please use at least 8 characters with a mix of uppercase, lowercase, and numbers.';
    }
    if (lower.includes('invalid email')) {
      return 'Please provide a valid email address.';
    }
    if (lower.includes('network') || lower.includes('failed to fetch')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    if (lower.includes('jwt expired') || lower.includes('session expired') || lower.includes('invalid token')) {
      return 'Your session has expired. Please sign in again or request a new reset link.';
    }

    return msg || 'An unexpected error occurred. Please try again.';
  };

  // Fetch public.profiles record for a specific user ID
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr) {
        if (profileErr.code === 'PGRST116') {
          // Profile row not created yet
          return null;
        }
        console.warn('Profile fetch warning:', profileErr.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }, []);

  // Update last_login timestamp in public.profiles
  const updateLastLogin = useCallback(async (userId) => {
    if (!userId) return;
    try {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (err) {
      console.warn('Error updating last_login timestamp:', err);
    }
  }, []);

  // Load session and profile on initialization
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting initial session:', sessionError);
      }

      setSession(initialSession);

      if (initialSession?.user) {
        setUser(initialSession.user);
        const userProfile = await fetchProfile(initialSession.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (currentSession?.user) {
          setUser(currentSession.user);
          const userProfile = await fetchProfile(currentSession.user.id);
          setProfile(userProfile);

          if (event === 'SIGNED_IN') {
            await updateLastLogin(currentSession.user.id);
          }
        }
      } else if (event === 'PASSWORD_RECOVERY') {
        if (currentSession?.user) {
          setUser(currentSession.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, fetchProfile, updateLastLogin]);

  // Sign Up with full name and phone passed via user metadata
  const signUp = async (email, password, fullName, phone) => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (authError) throw authError;

      const requiresConfirmation = data.user && !data.session;
      if (requiresConfirmation) {
        setError('Please check your email inbox to verify your account before logging in.');
      }

      return { data, error: null, requiresConfirmation };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { data: null, error: formatted };
    }
  };

  // Sign In with email & password + suspended status check
  const signIn = async (email, password) => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        setUser(data.user);
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);

        // Enforce account suspension check
        if (userProfile?.status === 'suspended') {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setSession(null);
          const suspendedMsg = 'Your account has been suspended. Please contact support at avnimisra7602@gmail.com.';
          setError(suspendedMsg);
          return { data: null, error: suspendedMsg };
        }

        await updateLastLogin(data.user.id);
        return { data, error: null, profile: userProfile };
      }

      return { data, error: null };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { data: null, error: formatted };
    }
  };

  // Sign Out
  const signOut = async () => {
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error: null };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { error: formatted };
    }
  };

  // Reset Password for Email
  const resetPassword = async (email) => {
    setError(null);
    try {
      // Direct redirect URL to the reset password route
      const redirectUrl = `${window.location.origin}/#reset-password`;
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (authError) throw authError;

      return { error: null };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { error: formatted };
    }
  };

  // Update Password (used during reset password flow)
  const updatePassword = async (newPassword) => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (authError) throw authError;

      if (data.user) {
        setUser(data.user);
      }

      return { data, error: null };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { data: null, error: formatted };
    }
  };

  // Safe update for public.profiles (strictly filtering out role, status, id)
  const updateProfile = async (updates) => {
    setError(null);
    try {
      if (!user) throw new Error('No authenticated user session found.');

      // Whitelist only allowed customer-editable fields
      const allowedFields = [
        'full_name',
        'phone',
        'avatar_url',
        'language',
        'state',
        'city',
        'deity_size_preference'
      ];

      const filteredUpdates = {};
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('No valid profile fields provided for update.');
      }

      const { data, error: updateErr } = await supabase
        .from('profiles')
        .update({
          ...filteredUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { data: null, error: formatted };
    }
  };

  // Update user auth metadata
  const updateAuthUser = async (metadataUpdates) => {
    setError(null);
    try {
      const { data, error: authErr } = await supabase.auth.updateUser({
        data: metadataUpdates,
      });

      if (authErr) throw authErr;

      if (data.user) {
        setUser(data.user);
      }

      return { data, error: null };
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      return { data: null, error: formatted };
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isSuspended = profile?.status === 'suspended';
  const isAuthenticated = !!user && !!session;

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    setError,
    isAuthenticated,
    isAdmin,
    isSuspended,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    updateAuthUser,
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