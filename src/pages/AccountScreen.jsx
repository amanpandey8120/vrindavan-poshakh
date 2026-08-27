import React, { useState, useEffect } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export default function AccountScreen() {
  const { navigateTo, wishlist } = useNavigation();
  const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    deitySize: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: profile?.phone || user.user_metadata?.phone || '',
        city: profile?.city || '',
        state: profile?.state || '',
        deitySize: profile?.deity_size_preference || '',
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Whitelisted profile fields only — never pass role, status, or id
    const updates = {
      full_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      deity_size_preference: formData.deitySize.trim(),
    };

    const { error: profileError } = await updateProfile(updates);

    if (profileError) {
      setSaveError(profileError);
    } else {
      setSaveSuccess(true);
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigateTo(SCREENS.HOME);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto flex items-center justify-center">
        <div className="material-symbols-outlined text-[48px] text-[#735c00] animate-spin">sync</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl border border-[#c1c7cb]/20 max-w-md shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-[#41484b]">account_circle</span>
          <h2 className="text-xl font-serif font-bold text-[#00151b] mt-4">Please Sign In</h2>
          <p className="text-xs text-[#41484b] mt-2 leading-relaxed">
            You need to be signed in to view your devotee account details and orders.
          </p>
          <button
            onClick={() => navigateTo(SCREENS.LOGIN)}
            className="mt-6 gold-gradient-bg text-[#00151b] px-6 py-2.5 rounded-full text-xs font-bold shadow-sm"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-[#fed65b]/40 border-2 border-[#735c00] flex items-center justify-center text-[#735c00] text-2xl font-bold">
            <span className="text-[28px]">{getInitials(formData.fullName || user.user_metadata?.full_name)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#00151b]">
              {formData.fullName || user.user_metadata?.full_name || 'Devotee'}
            </h1>
            <p className="text-xs text-[#41484b] mt-0.5">
              {user.email} {formData.phone && `• ${formData.phone}`}
            </p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-[#fed65b]/30 text-[#745c00] border border-[#fed65b]">
                {profile?.role === 'admin' ? 'Administrator' : 'Devotee Patron'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#dcfce7] text-[#166534] border border-[#86efac]">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {profile?.role === 'admin' && (
            <button
              onClick={() => navigateTo(SCREENS.ADMIN_ANALYTICS)}
              className="px-5 py-2.5 rounded-full bg-[#00151b] text-white text-xs font-bold hover:bg-[#735c00] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">shield_person</span>
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 rounded-full border border-[#ef4444] text-xs font-bold text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-4 space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: 'account_circle' },
            { id: 'orders', label: 'My Orders', icon: 'package_2' },
            { id: 'addresses', label: 'Saved Addresses', icon: 'home_pin' },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: 'favorite' },
            { id: 'help', label: 'Help & Devotional FAQ', icon: 'help_outline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'wishlist') navigateTo(SCREENS.SHOP);
                else setActiveTab(tab.id);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-left text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#fed65b] text-[#745c00] font-bold shadow-xs'
                  : 'bg-white text-[#41484b] hover:bg-[#f0eee9] border border-[#c1c7cb]/20'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Tab Content */}
        <div className="lg:col-span-8">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20 space-y-6">
              <div className="flex justify-between items-center border-b border-[#c1c7cb]/30 pb-3">
                <h3 className="text-lg font-serif font-bold text-[#00151b]">
                  Personal Information
                </h3>
                <span className="text-xs text-[#71787b]">Connected to Supabase</span>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-[#dcfce7] border border-[#22c55e]/30 text-[#166534] text-xs rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Profile updated successfully in public.profiles!</span>
                </div>
              )}

              {saveError && (
                <div className="p-3 bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-xs rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none focus:border-[#735c00] transition-colors"
                      disabled={isSaving}
                      placeholder="Devotee Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none cursor-not-allowed opacity-70"
                      disabled
                    />
                    <p className="text-[11px] text-[#71787b] mt-1">Managed securely by Supabase Auth</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none focus:border-[#735c00] transition-colors"
                      disabled={isSaving}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none focus:border-[#735c00] transition-colors"
                      disabled={isSaving}
                      placeholder="e.g., Mathura"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none focus:border-[#735c00] transition-colors"
                      disabled={isSaving}
                      placeholder="e.g., Uttar Pradesh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">
                      Deity Size Preference
                    </label>
                    <input
                      type="text"
                      name="deitySize"
                      value={formData.deitySize}
                      onChange={handleChange}
                      className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none focus:border-[#735c00] transition-colors"
                      placeholder="e.g., Laddu Gopal No. 3 (5–6 inch)"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="gold-gradient-bg text-[#00151b] px-6 py-2.5 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20 space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#00151b] border-b border-[#c1c7cb]/30 pb-3">
                Order History
              </h3>
              {[
                { id: 'ORD-2026-8942', date: '26 Aug 2026', total: '₹5,247', status: 'Processing' },
                { id: 'ORD-2026-8712', date: '14 Jul 2026', total: '₹3,499', status: 'Delivered' },
                { id: 'ORD-2026-8401', date: '22 May 2026', total: '₹1,850', status: 'Delivered' },
              ].map((ord) => (
                <div key={ord.id} className="p-4 border border-[#c1c7cb]/30 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#00151b]">{ord.id}</span>
                    <p className="text-xs text-[#41484b] mt-0.5">{ord.date} • Total: {ord.total}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#fed65b]/20 text-[#745c00] text-xs font-bold rounded-full">
                    {ord.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20 space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#00151b] border-b border-[#c1c7cb]/30 pb-3">
                Saved Addresses
              </h3>
              <div className="p-4 border-2 border-[#735c00]/40 rounded-xl bg-[#fbf9f4]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">Default Home Address</span>
                  <span className="material-symbols-outlined text-[18px] text-[#735c00]">check_circle</span>
                </div>
                <p className="text-sm font-semibold text-[#00151b]">{formData.fullName || user.user_metadata?.full_name || 'Aarav Sharma'}</p>
                <p className="text-xs text-[#41484b] mt-1 leading-relaxed">
                  {formData.city ? `${formData.city}, ${formData.state || 'India'}` : 'H3PQ+7W6, Gali Number 1, P Block, Sadh Nagar II, Palam, New Delhi, Delhi – 110045'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20 space-y-4">
              <h3 className="text-lg font-serif font-bold text-[#00151b] border-b border-[#c1c7cb]/30 pb-3">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 text-xs text-[#41484b]">
                <div>
                  <p className="font-bold text-[#00151b]">How do I measure my deity for Poshakh?</p>
                  <p className="mt-1">Measure from the lotus base to the crown of your Krishna in inches, or use our Fit Assistant.</p>
                </div>
                <div>
                  <p className="font-bold text-[#00151b]">What fabrics are used?</p>
                  <p className="mt-1">Pure silk, velvet, cotton and genuine gold-plated zardozi embroidery crafted by master artisans in Vrindavan.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
