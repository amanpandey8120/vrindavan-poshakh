import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginScreen() {
  const { navigateTo } = useNavigation();
  const { signIn, signOut, user, isAdmin, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigateTo(SCREENS.ADMIN_ANALYTICS);
    }
  }, [user, isAdmin, navigateTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { data, error: signInError, profile } = await signIn(email, password);

    if (signInError) {
      setIsSubmitting(false);
      return;
    }

    if (data?.user) {
      if (profile?.role === 'admin') {
        setRedirecting(true);
        navigateTo(SCREENS.ADMIN_ANALYTICS);
      } else {
        // Non-admin account: immediately revoke session
        await signOut();
        setError('Access denied. Administrator privileges are required to access this portal.');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-16 bg-[#fbf9f4] relative overflow-hidden">
      {/* Background radial gradient mesh — matches Stitch */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#c3e8f7_0%,transparent_50%),radial_gradient(ellipse_at_bottom_right,#fed65b_0%,transparent_50%)] opacity-30 pointer-events-none" />

      {/* Login Card Canvas — matches Stitch max-w-[480px] */}
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_16px_40px_-15px_rgba(0,21,27,0.1)] relative overflow-hidden border border-[#c1c7cb]/20 z-10">
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#fed65b] to-[#ffe088]" />

        <div className="p-8 md:p-12">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#f0eee9] flex items-center justify-center mx-auto mb-4 text-[#00151b]">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_person
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] tracking-tight">
              Vrindavan Poshakh
            </h1>
            <p className="text-xs font-bold text-[#41484b] mt-2 tracking-widest uppercase opacity-75">
              Admin Secure Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-sm rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span className="text-xs leading-tight">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {(loading || redirecting) && (
            <div className="mb-6 p-3 bg-[#fef3c7] border border-[#f59e0b]/30 text-[#92400e] text-xs rounded-lg flex items-center gap-2 justify-center font-medium">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              <span>{redirecting ? 'Access verified. Redirecting to dashboard...' : 'Verifying admin authorization...'}</span>
            </div>
          )}

          {/* Login Form */}
          {!redirecting && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="relative">
                <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || loading}
                  className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 outline-none transition-colors disabled:opacity-50"
                  placeholder="admin@vrindavanposhakh.com"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting || loading}
                    className="w-full bg-[#fbf9f4] border-0 border-b border-[#00151b]/30 text-base text-[#00151b] focus:ring-0 focus:border-[#735c00] focus:border-b-2 py-2 px-1 pr-10 outline-none transition-colors disabled:opacity-50"
                    placeholder="••••••••••••"
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

              {/* Action Area */}
              <div className="mt-3 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-gradient-to-r from-[#ffe088] to-[#fed65b] text-[#745c00] py-3.5 rounded-lg text-base font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 border border-[#fed65b]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to Admin Portal</span>
                      <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#c1c7cb]/20">
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
                    Admin Help
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
