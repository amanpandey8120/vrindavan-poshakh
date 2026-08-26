import React, { useState } from 'react';
import { useNavigation, SCREENS } from '../context/NavigationContext';

export default function AccountScreen() {
  const { navigateTo, wishlist } = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <main className="min-h-screen bg-[#fbf9f4] pt-24 pb-28 md:pb-16 px-4 md:px-16 max-w-[1280px] mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#c1c7cb]/20 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-[#fed65b]/40 border-2 border-[#735c00] flex items-center justify-center text-[#735c00] text-2xl font-bold">
            <span className="material-symbols-outlined text-[40px]">person</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#00151b]">Aarav Sharma</h1>
            <p className="text-xs text-[#41484b] mt-0.5">aarav.sharma@example.com • +91 98765 43210</p>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-[#fed65b]/30 text-[#745c00] mt-2 border border-[#fed65b]">
              Devotee Patron
            </span>
          </div>
        </div>

        {/* Quick Admin Access Link */}
        <button
          onClick={() => navigateTo(SCREENS.ADMIN_LOGIN)}
          className="px-5 py-2.5 rounded-full border border-[#00151b] text-xs font-bold text-[#00151b] hover:bg-[#00151b] hover:text-white transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">shield_person</span>
          <span>Access Admin Portal</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-4 space-y-2">
          {[
            { id: 'profile', label: 'My Profile', icon: 'account_circle' },
            { id: 'orders', label: 'My Orders (3)', icon: 'package_2' },
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
              <h3 className="text-lg font-serif font-bold text-[#00151b] border-b border-[#c1c7cb]/30 pb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" defaultValue="Aarav Sharma" className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">Email</label>
                  <input type="email" defaultValue="aarav.sharma@example.com" className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#41484b] uppercase tracking-wider mb-1">Deity Size Preference</label>
                  <input type="text" defaultValue="Laddu Gopal No. 3 (5–6 inch)" className="w-full bg-[#fbf9f4] border-0 border-b border-[#c1c7cb] p-2 text-sm text-[#00151b] outline-none" />
                </div>
              </div>
              <button className="gold-gradient-bg text-[#00151b] px-6 py-2.5 rounded-full text-xs font-bold">
                Save Changes
              </button>
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
                <p className="text-sm font-semibold text-[#00151b]">Aarav Sharma</p>
                <p className="text-xs text-[#41484b] mt-1 leading-relaxed">
                  H3PQ+7W6, Gali Number 1, P Block, Sadh Nagar II, Palam, New Delhi, Delhi – 110045
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
