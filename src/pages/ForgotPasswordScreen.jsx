import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const { navigateTo } = useNavigation();
  const { resetPassword, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: resetError } = await resetPassword(email);

    if (!resetError) {
      setSuccess(true);
    }

    setIsSubmitting(false);
  };

  const handleBackToLogin = () => {
    navigateTo(SCREENS.LOGIN);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-16 bg-[#fbf9f4] relative overflow-hidden">
      {/* Background radial gradient mesh — matches Stitch */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#c3e8f7_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,#fed65b_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Forgot Password Card Canvas — matches Stitch max-w-[480px] */}
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_16px_40px_-15px_rgba(0,21,27,0.1)] relative overflow-hidden border border-[#c1c7cb]/20 z-10">
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#fed65b] to-[#ffe088]" />

        <div className="p-8 md:p-12">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-full bg-[#f0eee9] flex items-center justify-center mx-auto mb-4 text-[#00151b]">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock_reset
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-xs font-bold text-[#41484b] mt-2 tracking-widest uppercase opacity-75">
              Enter your email to reset your password
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-[#dcfce7] border border-[#22c55e]/30 text-[#166534] text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Password reset email sent! Check your inbox.</span>
            </div>
          )}

          {/* Error Message */}
          {error && !success && (
            <div className="mb-6 p-3 bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Forgot Password Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="relative">
                <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>

              {/* Action Area */}
              <div className="mt-4 flex flex-col gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#ffe088] to-[#fed65b] text-[#745c00] py-4 rounded-lg text-base font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 border border-[#fed65b]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-[#41484b] pt-2">
                  <span>Remember your password? </span>
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-[#735c00] font-bold hover:underline transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => navigateTo(SCREENS.HOME)}
                    className="text-[#41484b] hover:text-[#00151b] transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                    Back to Store
                  </button>
                  <a href="#help" onClick={(e) => e.preventDefault()} className="text-[#41484b] hover:text-[#00151b] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">support_agent</span>
                    Help Desk
                  </a>
                </div>
              </div>
            </form>
          )}

          {success && (
            <div className="mt-4 flex flex-col gap-5">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-[#ffe088] to-[#fed65b] text-[#745c00] py-4 rounded-lg text-base font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 border border-[#fed65b]/50"
              >
                <span>Back to Sign In</span>
                <span className="material-symbols-outlined text-[20px]">login</span>
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => navigateTo(SCREENS.HOME)}
                  className="text-[#41484b] hover:text-[#00151b] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  Back to Store
                </button>
                <a href="#help" onClick={(e) => e.preventDefault()} className="text-[#41484b] hover:text-[#00151b] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">support_agent</span>
                  Help Desk
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}