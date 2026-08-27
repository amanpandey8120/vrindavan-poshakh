import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordScreen() {
  const { navigateTo } = useNavigation();
  const { session, user, updatePassword, error, setError, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if session or recovery access token is available
  const hasValidSession = !!(session?.user || user);

  const validateForm = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter (A-Z).');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter (a-z).');
      return false;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number (0-9).');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await updatePassword(password);

    if (!updateError) {
      setIsSuccess(true);
      setTimeout(() => {
        navigateTo(SCREENS.LOGIN);
      }, 2000);
    }

    setIsSubmitting(false);
  };

  if (!loading && !hasValidSession && !isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-16 bg-[#fbf9f4] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#c3e8f7_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,#fed65b_0%,transparent_50%)] opacity-30 pointer-events-none" />
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_16px_40px_-15px_rgba(0,21,27,0.1)] relative overflow-hidden border border-[#c1c7cb]/20 z-10">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#fed65b] to-[#ffe088]" />
          <div className="p-8 md:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-4 text-[#991b1b]">
              <span className="material-symbols-outlined text-[36px]">error</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] tracking-tight">
              Session Expired
            </h1>
            <p className="text-xs font-bold text-[#41484b] mt-2 tracking-widest uppercase opacity-75 leading-relaxed">
              This password reset link is invalid or has expired.
            </p>
            <p className="text-xs text-[#71787b] mt-3">
              Please request a fresh reset link from our forgot password page.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => navigateTo(SCREENS.FORGOT_PASSWORD)}
                className="w-full bg-gradient-to-r from-[#ffe088] to-[#fed65b] text-[#745c00] py-3 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all"
              >
                Request New Reset Link
              </button>
              <button
                onClick={() => navigateTo(SCREENS.LOGIN)}
                className="text-xs text-[#41484b] hover:text-[#00151b] transition-colors py-2"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-16 bg-[#fbf9f4] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#c3e8f7_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,#fed65b_0%,transparent_50%)] opacity-30 pointer-events-none" />
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_16px_40px_-15px_rgba(0,21,27,0.1)] relative overflow-hidden border border-[#c1c7cb]/20 z-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#fed65b] to-[#ffe088]" />
        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#f0eee9] flex items-center justify-center mx-auto mb-4 text-[#00151b]">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_reset
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] tracking-tight">
              Create New Password
            </h1>
            <p className="text-xs font-bold text-[#41484b] mt-2 tracking-widest uppercase opacity-75">
              Secure your devotee account
            </p>
          </div>

          {isSuccess && (
            <div className="mb-6 p-4 bg-[#dcfce7] border border-[#22c55e]/30 text-[#166534] text-sm rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">check_circle</span>
              <div>
                <p className="font-bold text-sm">Password Updated!</p>
                <p className="text-xs mt-1">Your password has been changed successfully. Redirecting to login...</p>
              </div>
            </div>
          )}

          {error && !isSuccess && (
            <div className="mb-6 p-3 bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span className="text-xs leading-tight">{error}</span>
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isSubmitting}
                    className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 pr-10 outline-none transition-colors disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-2 top-2 text-[#41484b] hover:text-[#00151b] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">lock_outline</span>
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <p className="text-[11px] text-[#71787b]">
                Must be at least 8 characters with uppercase, lowercase, and a number.
              </p>

              <div className="mt-2 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#ffe088] to-[#fed65b] text-[#745c00] py-3.5 rounded-lg text-base font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 border border-[#fed65b]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-[#41484b] pt-1">
                  <span>Remember your password? </span>
                  <button
                    type="button"
                    onClick={() => navigateTo(SCREENS.LOGIN)}
                    className="text-[#735c00] font-bold hover:underline transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-[#c1c7cb]/20">
                  <button
                    type="button"
                    onClick={() => navigateTo(SCREENS.HOME)}
                    className="text-[#41484b] hover:text-[#00151b] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                    Back to Store
                  </button>
                  <a href="mailto:avnimisra7602@gmail.com" className="text-[#41484b] hover:text-[#00151b] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">support_agent</span>
                    Help Desk
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}